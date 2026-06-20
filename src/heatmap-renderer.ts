import simpleheat, { type SimpleHeat } from "simpleheat";

import { cropBounds, projectPoint } from "./projection";
import type { ColorTheme, CropBounds, CropMode, HeatmapPoint, ScaleMode } from "./types";

const GRADIENTS: Record<ColorTheme, Record<number, string>> = {
  default: { 0.2: "#2b7bff", 0.45: "#39d98a", 0.7: "#ffe15c", 1.0: "#ff4d4d" },
  reds: { 0.2: "#ffd2c4", 0.45: "#ff8a66", 0.7: "#ff3d1a", 1.0: "#8c1400" },
  yellows: { 0.2: "#fff6c4", 0.45: "#ffe066", 0.7: "#ffc107", 1.0: "#9c7300" },
  greens: { 0.2: "#cdf7d8", 0.45: "#6fe08a", 0.7: "#22b14c", 1.0: "#0b4d20" },
  blues: { 0.2: "#cfe3ff", 0.45: "#7fb0ff", 0.7: "#2f6fff", 1.0: "#0a2a8c" },
  oranges: { 0.2: "#ffe0bd", 0.45: "#ffb066", 0.7: "#ff7a1a", 1.0: "#8c4400" },
  purples: { 0.2: "#e6d4ff", 0.45: "#bb84ff", 0.7: "#8b2bff", 1.0: "#3d0a8c" },
};

export interface RenderOptions {
  blur: number;
  colorTheme: ColorTheme;
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
    this.heat.resize();
    this.heat
      .data(heatPoints)
      .max(maxScaledValue)
      .radius(options.radius, options.blur)
      .gradient(GRADIENTS[options.colorTheme])
      .draw(options.opacity);

    return bounds;
  }
}
