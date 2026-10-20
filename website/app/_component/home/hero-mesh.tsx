'use client';

import { useEffect, useRef } from 'react';
import type { WetrendsMeshRenderer } from '@/lib/brand/mesh/WetrendsMeshRenderer.js';

const FRAME_INTERVAL = 1000 / 30;
const MAX_PIXELS = 1_000_000;

/** The source WebP paints first; WebGL takes over only after its first valid frame. */
export default function HeroMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const surface = canvas?.closest('section');
    // On narrow screens the CSS orbit in hero.tsx keeps the mesh moving without
    // the long WebGL shader compile seen under mobile CPU throttling.
    if (!canvas || !surface || window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 767px)').matches) return;

    let disposed = false;
    let visible = false;
    let renderer: WetrendsMeshRenderer | null = null;
    let animationFrame = 0;
    let lastFrame = 0;
    let hover = 0;
    let hoverTarget = 0;
    let pointer: [number, number] = [0.5, 0.5];
    const startedAt = performance.now();

    const resize = () => {
      if (!renderer) return;
      const { width, height } = surface.getBoundingClientRect();
      const scale = Math.min(1, Math.sqrt(MAX_PIXELS / Math.max(1, width * height)));
      renderer.resize(width, height, scale);
    };

    const stop = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };

    const draw = (now: number) => {
      animationFrame = requestAnimationFrame(draw);
      if (!renderer || now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;
      hover += (hoverTarget - hover) * 0.15;
      try {
        renderer.renderAtTime((now - startedAt) / 1000, {
          speed: 1,
          fade: 0,
          pointer,
          hover,
        });
      } catch (error) {
        stop();
        canvas.style.opacity = '0';
        renderer.destroy();
        renderer = null;
        if (process.env.NODE_ENV === 'development') console.error('Hero mesh stopped:', error);
      }
    };

    const start = () => {
      if (renderer?.isReady && visible && !document.hidden && !animationFrame) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const rect = surface.getBoundingClientRect();
      pointer = [
        Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
        Math.min(1, Math.max(0, 1 - (event.clientY - rect.top) / rect.height)),
      ];
      hoverTarget = 1;
    };
    const onPointerLeave = () => { hoverTarget = 0; };
    const onVisibilityChange = () => { if (document.hidden) stop(); else start(); };

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    });
    intersection.observe(surface);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(surface);
    surface.addEventListener('pointermove', onPointerMove);
    surface.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Split shader code from the first paint. The still image remains visible on failure.
    const loadTimer = window.setTimeout(async () => {
      try {
        const { createWetrendsMesh } = await import('@/lib/brand/mesh/WetrendsMeshRenderer.js');
        if (disposed) return;
        renderer = createWetrendsMesh(canvas, { textureUrl: '/images/hero_background.webp' });
        await renderer.ready;
        if (disposed) return;
        resize();
        canvas.style.opacity = '1';
        start();
      } catch (error) {
        if (!disposed && process.env.NODE_ENV === 'development') console.error('Hero mesh unavailable:', error);
      }
    }, 0);

    return () => {
      disposed = true;
      clearTimeout(loadTimer);
      stop();
      intersection.disconnect();
      resizeObserver.disconnect();
      surface.removeEventListener('pointermove', onPointerMove);
      surface.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      renderer?.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500" aria-hidden="true" />;
}
