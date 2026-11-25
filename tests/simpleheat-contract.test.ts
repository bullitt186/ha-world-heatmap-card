import { afterEach, describe, expect, it, vi } from "vitest";

import { HeatmapRenderer } from "../src/heatmap-renderer";

// Runs the renderer against the real simpleheat package (not mocked), on a fake 2D canvas: a
// change of the library's API (a class that needs `new`, a removed method) fails here instead of
// in the browser. The fake implements the canvas calls simpleheat makes and records the drawing.
interface Drawn {
  images: [number, number][];
  puts: number;
}

function fakeContext(canvas: { width: number; height: number }, drawn: Drawn) {
  return {
    canvas,
    globalAlpha: 1,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    shadowColor: "",
    fillStyle: "",
    beginPath() {},
    arc() {},
    fill() {},
    fillRect() {},
    clearRect() {},
    createLinearGradient: () => ({ addColorStop() {} }),
    getImageData: (_x: number, _y: number, w: number, h: number) => ({
      data: new Uint8ClampedArray(w * h * 4),
    }),
    drawImage: (_image: unknown, x: number, y: number) => drawn.images.push([x, y]),
    putImageData: () => {
      drawn.puts += 1;
    },
  };
}

class FakeOffscreenCanvas {
  constructor(
    public width: number,
    public height: number,
  ) {}
  getContext() {
    return fakeContext(this, { images: [], puts: 0 });
  }
}

function fakeCanvas(width: number, height: number) {
  const drawn: Drawn = { images: [], puts: 0 };
  const canvas = { width, height, getContext: () => fakeContext(canvas, drawn) };
  return { canvas: canvas as unknown as HTMLCanvasElement, drawn };
}

const OPTIONS = {
  blur: 0,
  colorTheme: "default" as const,
  crop: "world" as const,
  floor: 0.32,
  opacity: 0.16,
  radius: 10,
  scale: "linear" as const,
};

describe("HeatmapRenderer with the real simpleheat", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("draws one blurred circle per point and colorizes the canvas", () => {
    vi.stubGlobal("OffscreenCanvas", FakeOffscreenCanvas);
    const { canvas, drawn } = fakeCanvas(360, 180);
    new HeatmapRenderer(canvas).render(
      [
        { lat: 0, lon: 0, value: 10 },
        { lat: 45, lon: 90, value: 5 },
      ],
      OPTIONS,
    );
    // circle of radius + blur = 10, drawn with its top left corner at (x - 10, y - 10)
    expect(drawn.images).toEqual([
      [170, 80],
      [260, 35],
    ]);
    expect(drawn.puts).toBe(1);
  });

  it("draws at the canvas size of each render, without a resize call", () => {
    vi.stubGlobal("OffscreenCanvas", FakeOffscreenCanvas);
    const { canvas, drawn } = fakeCanvas(360, 180);
    const renderer = new HeatmapRenderer(canvas);
    renderer.render([{ lat: 0, lon: 0, value: 1 }], OPTIONS);
    canvas.width = 720;
    canvas.height = 360;
    renderer.render([{ lat: 0, lon: 0, value: 1 }], OPTIONS);
    expect(drawn.images).toEqual([
      [170, 80],
      [350, 170],
    ]);
  });
});
