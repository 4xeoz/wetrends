export type WetrendsMeshControls = {
  /** 1 is a 20-second loop. Values are clamped to 0.1–10. */
  speed?: number;
  /** 0 keeps the source colour; 1 fades to white by colour and inferred wave depth. */
  fade?: number;
  /** Explicit radians override time × speed for custom or varying speed curves. */
  phase?: number;
  /** Bottom-origin normalized position. */
  pointer?: readonly [number, number];
  /** Pointer influence from 0 to 1. Set 0 for a clean video export. */
  hover?: number;
};

export type WetrendsMeshOptions = {
  width?: number;
  height?: number;
  dpr?: number;
  /** Optional image URL; the exact homepage WebP is used by default. */
  textureUrl?: string;
};

export type WetrendsMeshRenderer = {
  readonly ready: Promise<WetrendsMeshRenderer>;
  readonly isReady: boolean;
  resize(width?: number, height?: number, dpr?: number): void;
  renderAtTime(seconds: number, controls?: WetrendsMeshControls): void;
  renderFrame(frame: number, fps: number, controls?: WetrendsMeshControls): void;
  destroy(): void;
};

export function createWetrendsMesh(
  canvas: HTMLCanvasElement,
  options?: WetrendsMeshOptions,
): WetrendsMeshRenderer;
