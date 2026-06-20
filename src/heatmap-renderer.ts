import simpleheat, { type SimpleHeat } from "simpleheat";

import { cropBounds, projectPoint } from "./projection";
import type { CropBounds, CropMode, HeatmapPoint, ScaleMode } from "./types";

export interface RenderOptions {
  blur: number;
  crop: CropMode;
  floor: number;
  opacity: number;
  radius: number;
  scale: ScaleMode;
}

function scaledValue(value: number, scale: ScaleMode): number {
  if (scale === "linear") return value;
  if (scale === "sqrt") return Math.sqrt(value);
  return Math.log1p(value);
}

export class HeatmapRenderer {
  private heat?: SimpleHeat;

  constructor(private readonly canvas: HTMLCanvasElement) {}

  render(points: HeatmapPoint[], options: RenderOptions): CropBounds {
    const bounds = cropBounds(points, options.crop);
    const width = this.canvas.width;
    const height = this.canvas.height;
    const validPoints = points.filter(
      (point) =>
        Number.isFinite(point.lat) &&
        Number.isFinite(point.lon) &&
        Number.isFinite(point.value) &&
        point.value > 0,
    );
    const maxScaledValue = Math.max(
      ...validPoints.map((point) => scaledValue(point.value, options.scale)),
      1,
    );
    const floor = Math.min(Math.max(options.floor, 0), 0.6);
    const heatPoints: [number, number, number][] = validPoints.map((point) => {
      const [x, y] = projectPoint(point, bounds, width, height);
      const normalized = scaledValue(point.value, options.scale) / maxScaledValue;
      const boosted = floor + normalized * (1 - floor);
      return [x, y, boosted * maxScaledValue];
    });

    this.heat ??= simpleheat(this.canvas);
    this.heat
      .data(heatPoints)
      .max(maxScaledValue)
      .radius(options.radius, options.blur)
      .gradient({
        0.2: "#2b7bff",
        0.45: "#39d98a",
        0.7: "#ffe15c",
        1.0: "#ff4d4d",
      })
      .draw(options.opacity);

    return bounds;
  }
}
