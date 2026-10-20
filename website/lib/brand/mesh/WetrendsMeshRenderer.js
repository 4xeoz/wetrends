import { fragmentSource, vertexSource } from "./shaders.js";

const TAU = Math.PI * 2;
const BASE_LOOP_SECONDS = 20;

function clamp(value, minimum, maximum, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(maximum, Math.max(minimum, number)) : fallback;
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Could not create a WebGL shader.");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || "Unknown shader compile error.";
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

function wrapPhase(value) {
  return ((value % TAU) + TAU) % TAU;
}

/**
 * Frame-driven WeTrends mesh. The supplied WebP is the exact colour source;
 * all orbit, wave, hover and colour-aware fade motion runs in the fragment shader.
 * The white W logo is intentionally a separate asset and layer.
 */
export function createWetrendsMesh(canvas, options = {}) {
  if (!canvas || typeof canvas.getContext !== "function") {
    throw new TypeError("createWetrendsMesh requires a canvas element.");
  }

  // Video captures can happen after the browser's normal canvas compositing.
  // Keep the completed GPU frame available for the compositor and screenshots.
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: true,
  });
  if (!gl) throw new Error("WebGL 1 is unavailable; this shader cannot render.");

  let vertexShader;
  let fragmentShader;
  let program;
  let buffer;
  let texture;
  try {
    vertexShader = compile(gl, gl.VERTEX_SHADER, vertexSource);
    fragmentShader = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
    program = gl.createProgram();
    if (!program) throw new Error("Could not create a WebGL program.");
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || "Could not link the mesh shader.");
    }
    buffer = gl.createBuffer();
    texture = gl.createTexture();
    if (!buffer || !texture) throw new Error("Could not allocate mesh GPU resources.");
  } catch (error) {
    if (buffer) gl.deleteBuffer(buffer);
    if (texture) gl.deleteTexture(texture);
    if (program) gl.deleteProgram(program);
    if (vertexShader) gl.deleteShader(vertexShader);
    if (fragmentShader) gl.deleteShader(fragmentShader);
    throw error;
  }

  gl.useProgram(program);
  const position = gl.getAttribLocation(program, "a_position");
  const uniforms = {
    resolution: gl.getUniformLocation(program, "u_resolution"),
    imageResolution: gl.getUniformLocation(program, "u_image_resolution"),
    phase: gl.getUniformLocation(program, "u_phase"),
    source: gl.getUniformLocation(program, "u_source"),
    pointer: gl.getUniformLocation(program, "u_pointer"),
    hover: gl.getUniformLocation(program, "u_hover"),
    fade: gl.getUniformLocation(program, "u_fade"),
  };
  if (position < 0) throw new Error("Mesh vertex attribute is missing.");
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);

  let destroyed = false;
  let loaded = false;
  let contextLost = false;
  let imageWidth = 1;
  let imageHeight = 1;
  let image;
  let rejectReady;
  let readySettled = false;

  function resize(width = options.width ?? canvas.clientWidth ?? canvas.width,
    height = options.height ?? canvas.clientHeight ?? canvas.height,
    dpr = options.dpr ?? 1) {
    if (destroyed) throw new Error("The mesh renderer has been destroyed.");
    const pixelWidth = Math.max(1, Math.round(clamp(width, 1, 16384, 1) * clamp(dpr, 0.1, 4, 1)));
    const pixelHeight = Math.max(1, Math.round(clamp(height, 1, 16384, 1) * clamp(dpr, 0.1, 4, 1)));
    if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
    if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  }

  function renderAtTime(seconds, controls = {}) {
    if (destroyed) throw new Error("The mesh renderer has been destroyed.");
    if (contextLost) throw new Error("The WebGL context was lost. Create a new mesh renderer.");
    if (!loaded) throw new Error("The mesh texture is still loading. Await renderer.ready.");
    if (!Number.isFinite(seconds)) throw new TypeError("Time must be a finite number of seconds.");

    const speed = clamp(controls.speed ?? 1, 0.1, 10, 1);
    const fade = clamp(controls.fade ?? 0, 0, 1, 0);
    const hover = clamp(controls.hover ?? 0, 0, 1, 0);
    const pointer = controls.pointer ?? [0.5, 0.5];
    const phase = Number.isFinite(controls.phase)
      ? controls.phase
      : TAU * seconds * speed / BASE_LOOP_SECONDS;

    gl.useProgram(program);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(uniforms.source, 0);
    gl.uniform2f(uniforms.resolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform2f(uniforms.imageResolution, imageWidth, imageHeight);
    gl.uniform1f(uniforms.phase, wrapPhase(phase));
    gl.uniform2f(uniforms.pointer,
      clamp(pointer[0], 0, 1, 0.5), clamp(pointer[1], 0, 1, 0.5));
    gl.uniform1f(uniforms.hover, hover);
    gl.uniform1f(uniforms.fade, fade);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    const error = gl.getError();
    if (error !== gl.NO_ERROR) throw new Error("WebGL mesh draw error " + error);
  }

  function renderFrame(frame, fps, controls = {}) {
    if (!Number.isFinite(frame)) throw new TypeError("Frame must be a finite number.");
    if (!Number.isFinite(fps) || fps <= 0) throw new TypeError("FPS must be positive.");
    renderAtTime(frame / fps, controls);
  }

  function onContextLost(event) {
    event.preventDefault();
    contextLost = true;
    if (!readySettled && rejectReady) {
      readySettled = true;
      rejectReady(new Error("WebGL context was lost while loading the mesh."));
    }
  }
  canvas.addEventListener("webglcontextlost", onContextLost);

  const renderer = {
    get ready() { return ready; },
    get isReady() { return loaded && !destroyed && !contextLost; },
    resize,
    renderAtTime,
    renderFrame,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      canvas.removeEventListener("webglcontextlost", onContextLost);
      if (image) { image.onload = null; image.onerror = null; }
      if (!readySettled && rejectReady) {
        readySettled = true;
        rejectReady(new Error("Mesh renderer was destroyed before loading."));
      }
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    },
  };

  const ready = new Promise((resolve, reject) => {
    rejectReady = reject;
    image = new Image();
    image.onload = () => {
      if (destroyed || contextLost) return;
      try {
        imageWidth = image.naturalWidth;
        imageHeight = image.naturalHeight;
        if (!imageWidth || !imageHeight) throw new Error("The mesh image has no dimensions.");
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        const error = gl.getError();
        if (error !== gl.NO_ERROR) throw new Error("WebGL texture upload error " + error);
        loaded = true;
        resize();
        renderFrame(0, 30);
        readySettled = true;
        resolve(renderer);
      } catch (error) {
        readySettled = true;
        reject(error);
      }
    };
    image.onerror = () => {
      readySettled = true;
      reject(new Error("The WeTrends WebP texture could not be decoded."));
    };
    // The website serves the source texture from the same origin.
    if (options.textureUrl && /^https?:/i.test(options.textureUrl)) {
      image.crossOrigin = "anonymous";
    }
    image.src = options.textureUrl ?? "/images/hero_background.webp";
  });

  return renderer;
}
