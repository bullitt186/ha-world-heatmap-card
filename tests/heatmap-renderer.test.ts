import { beforeEach, describe, expect, it, vi } from "vitest";

import type { HeatmapPoint } from "../src/types";

// simpleheat draws on a canvas; the fake records what the renderer passes to it. Like simpleheat
// 1.x it is a class (calling it without `new` throws) and has no resize(); the contract with the
// real library is checked in simpleheat-contract.test.ts.
const heat = vi.hoisted(() => {
  const calls: {
    data?: [number, number, number][];
    max?: number;
    draw?: number;
    radius?: [number, number];
    gradient?: Record<number, string>;
  } = {};
  class FakeSimpleHeat {
    data(points: [number, number, number][]) {
      calls.data = points;
      return this;
    }
    max(value: number) {
      calls.max = value;
      return this;
    }
    radius(radius: number, blur: number) {
      calls.radius = [radius, blur];
      return this;
    }
    gradient(stops: Record<number, string>) {
      calls.gradient = stops;
      return this;
    }
    draw(opacity: number) {
      calls.draw = opacity;
      return this;
    }
  }
  return { calls, FakeSimpleHeat };
});
vi.mock("simpleheat", () => ({ default: heat.FakeSimpleHeat }));

const { HeatmapRenderer } = await import("../src/heatmap-renderer");

const OPTIONS = {
  blur: 14,
  colorTheme: "default" as const,
  crop: "world" as const,
  floor: 0.32,
  opacity: 0.16,
  radius: 24,
  scale: "linear" as const,
};
const canvas = { width: 360, height: 180 } as HTMLCanvasElement;
const render = (points: HeatmapPoint[], options = {}) =>
  new HeatmapRenderer(canvas).render(points, { ...OPTIONS, ...options });

describe("HeatmapRenderer point scaling", () => {
  beforeEach(() => {
    delete heat.calls.data;
    delete heat.calls.max;
  });

  it("projects the points and lifts low values to the floor", () => {
    const bounds = render([
      { lat: 0, lon: 0, value: 10 },
      { lat: 45, lon: 90, value: 5 },
    ]);
    expect(bounds).toEqual({ north: 90, south: -90, west: -180, east: 180 });
    expect(heat.calls.max).toBe(10);
    // intensity = (floor + value / max * (1 - floor)) * max
    const [first, second] = heat.calls.data ?? [];
    expect(first).toEqual([180, 90, 10]);
    expect(second.slice(0, 2)).toEqual([270, 45]);
    expect(second[2]).toBeCloseTo((0.32 + 0.5 * 0.68) * 10);
    expect(heat.calls.draw).toBe(0.16);
  });

  it("drops points without a positive, finite value or position", () => {
    render([
      { lat: 0, lon: 0, value: 4 },
      { lat: 10, lon: 10, value: 0 },
      { lat: 10, lon: 10, value: -3 },
      { lat: Number.NaN, lon: 10, value: 3 },
      { lat: 10, lon: 10, value: Number.POSITIVE_INFINITY },
    ]);
    expect(heat.calls.data).toHaveLength(1);
  });

  it.each([
    ["log", Math.log1p(100)],
    ["sqrt", 10],
    ["linear", 100],
  ] as const)("scales values with %s", (scale, max) => {
    render([{ lat: 0, lon: 0, value: 100 }], { scale });
    expect(heat.calls.max).toBeCloseTo(max);
  });

  it("never sets the maximum below 1", () => {
    render([{ lat: 0, lon: 0, value: 0.25 }]);
    expect(heat.calls.max).toBe(1);
    expect(heat.calls.data?.[0][2]).toBeCloseTo(0.32 + 0.25 * 0.68);
  });

  it("clamps the floor to 0..0.6", () => {
    const points = [
      { lat: 0, lon: 0, value: 10 },
      { lat: 0, lon: 0, value: 0.0001 },
    ];
    render(points, { floor: 0.9 });
    expect(heat.calls.data?.[1][2]).toBeCloseTo(6, 3);
    render(points, { floor: -1 });
    expect(heat.calls.data?.[1][2]).toBeCloseTo(0.0001, 6);
  });
});

// Brightness of a #rrggbb colour (0..765), to check "pale to deep" in the README themes.
const brightness = (hex: string) =>
  [1, 3, 5].reduce((sum, i) => sum + Number.parseInt(hex.slice(i, i + 2), 16), 0);

describe("HeatmapRenderer drawing options", () => {
  it("passes radius, blur and opacity to simpleheat", () => {
    render([{ lat: 0, lon: 0, value: 1 }], { radius: 30, blur: 9, opacity: 0.3 });
    expect(heat.calls.radius).toEqual([30, 9]);
    expect(heat.calls.draw).toBe(0.3);
  });

  it("uses the default theme from blue over green and yellow to red", () => {
    render([{ lat: 0, lon: 0, value: 1 }], { colorTheme: "default" });
    expect(heat.calls.gradient).toEqual({
      0.2: "#2b7bff",
      0.45: "#39d98a",
      0.7: "#ffe15c",
      1.0: "#ff4d4d",
    });
  });

  it.each(["reds", "yellows", "greens", "blues", "oranges", "purples"] as const)(
    "%s goes from pale to deep",
    (colorTheme) => {
      render([{ lat: 0, lon: 0, value: 1 }], { colorTheme });
      const stops = heat.calls.gradient ?? {};
      // Numeric keys: "1" is an array index and comes first in Object.keys.
      const offsets = [0.2, 0.45, 0.7, 1];
      expect(Object.keys(stops).map(Number)).toHaveLength(4);
      const levels = offsets.map((offset) => brightness(stops[offset]));
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i]).toBeLessThan(levels[i - 1]);
      }
    },
  );
});
