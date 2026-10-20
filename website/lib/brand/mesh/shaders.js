// Website copy of the WeTrends motion shader in wetrends-motion-kit/component/shaders.js.
export const vertexSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

export const fragmentSource = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    uniform vec2 u_resolution;
    uniform vec2 u_image_resolution;
    uniform float u_phase;
    uniform sampler2D u_source;
    uniform vec2 u_pointer;
    uniform float u_hover;
    uniform float u_fade;

    vec2 cover(vec2 uv) {
      float frameAspect = u_resolution.x / u_resolution.y;
      float imageAspect = u_image_resolution.x / u_image_resolution.y;
      if (frameAspect > imageAspect) {
        uv.y = (uv.y - 0.5) * imageAspect / frameAspect + 0.5;
      } else {
        uv.x = (uv.x - 0.5) * frameAspect / imageAspect + 0.5;
      }
      return uv;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      vec2 centered = uv - 0.5;
      float shortest = min(u_resolution.x, u_resolution.y);
      vec2 aspect = vec2(shortest / u_resolution.x, shortest / u_resolution.y);
      float radius = length(centered / aspect);
      float edge = smoothstep(0.02, 0.85, radius);

      // The orbit grows with radius: the centre barely moves and the rim travels fastest.
      float angle = u_phase + edge * (
        0.12 * sin(2.0 * u_phase + radius * 3.6)
        + 0.045 * sin(5.0 * u_phase - radius * 7.2)
      );
      vec2 orbit = vec2(
        cos(angle), sin(angle)
      ) * (0.001 + 0.075 * edge * edge) * aspect;
      // Two moving sources cross near the centre. Their smooth wave heights add
      // where they overlap, so the fronts collide and merge without hard seams.
      vec2 point = centered / aspect;
      vec2 sourceA = vec2(-0.29 * cos(u_phase), 0.07 * sin(u_phase));
      vec2 sourceB = vec2( 0.29 * cos(u_phase), 0.05 * sin(u_phase));
      vec2 deltaA = point - sourceA;
      vec2 deltaB = point - sourceB;
      float distanceA = length(deltaA);
      float distanceB = length(deltaB);
      float falloffA = exp(-5.0 * dot(deltaA, deltaA));
      float falloffB = exp(-5.0 * dot(deltaB, deltaB));
      float crestA = sin(11.0 * distanceA - 3.0 * u_phase + 0.4 * point.y) * falloffA;
      float crestB = sin(11.0 * distanceB - 3.0 * u_phase - 0.4 * point.x) * falloffB;
      vec2 directionA = deltaA / max(distanceA, 0.001);
      vec2 directionB = deltaB / max(distanceB, 0.001);
      vec2 wave = aspect * 0.032 * (directionA * crestA + directionB * crestB);
      float merged = falloffA * falloffB;
      wave += aspect * 0.015 * merged * vec2(
        sin(2.0 * u_phase + 7.0 * point.y),
        cos(2.0 * u_phase - 7.0 * point.x)
      );

      // Only a hovered mouse contributes this local, smoothly fading swirl.
      vec2 fromPointer = point - (u_pointer - 0.5) / aspect;
      float influence = exp(-12.0 * dot(fromPointer, fromPointer)) * u_hover;
      vec2 hoverWave = aspect * influence * (
        0.055 * vec2(-fromPointer.y, fromPointer.x)
        + 0.030 * sin(2.0 * u_phase + 12.0 * length(fromPointer))
          * fromPointer / max(length(fromPointer), 0.001)
      );
      vec2 warped = 0.5 + centered * 0.73 + orbit + wave + hoverWave;
      vec4 colour = texture2D(u_source, cover(warped));

      // This is inferred visual depth, not a depth map: bright colour lifts
      // first, while dark colour and the stronger wave crests linger longer.
      float luminance = dot(colour.rgb, vec3(0.2126, 0.7152, 0.0722));
      float shadowDepth = smoothstep(0.24, 0.80, 1.0 - luminance);
      float waveDepth = clamp(
        0.40 * abs(crestA) + 0.40 * abs(crestB) + 0.35 * merged,
        0.0, 1.0
      );
      float fadeCurve = mix(0.68, 2.55, shadowDepth) + 0.40 * waveDepth;
      float whiteMix = pow(clamp(u_fade, 0.0, 1.0), fadeCurve);
      gl_FragColor = vec4(mix(colour.rgb, vec3(1.0), whiteMix), colour.a);
    }
  `;
