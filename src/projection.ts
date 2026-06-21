import type { CropBounds, CropMode, HeatmapPoint } from "./types";

export function cropBounds(points: HeatmapPoint[], mode: CropMode): CropBounds {
  if (mode === "world") {
    return { north: 90, south: -90, west: -180, east: 180 };
  }
  if (mode === "no_antarctica") {
    return { north: 85, south: -60, west: -180, east: 180 };
  }
  if (mode === "temperate") {
    return { north: 70, south: -55, west: -180, east: 180 };
  }

  const latitudes = points
    .map((point) => point.lat)
    .filter((lat) => Number.isFinite(lat));
  const longitudes = points
    .map((point) => point.lon)
    .filter((lon) => Number.isFinite(lon));

  if (!latitudes.length || !longitudes.length) {
    return { north: 85, south: -60, west: -180, east: 180 };
  }

  const latPadding = 7;
  const lonPadding = 12;
  const cropLongitude = mode === "tight_xy";

  return {
    north: Math.min(85, Math.max(...latitudes) + latPadding),
    south: Math.max(-60, Math.min(...latitudes) - latPadding),
    west: cropLongitude
      ? Math.max(-180, Math.min(...longitudes) - lonPadding)
      : -180,
    east: cropLongitude
      ? Math.min(180, Math.max(...longitudes) + lonPadding)
      : 180,
  };
}

export function projectPoint(
  point: Pick<HeatmapPoint, "lat" | "lon">,
  bounds: CropBounds,
  width: number,
  height: number,
): [number, number] {
  const latSpan = bounds.north - bounds.south;
  const lonSpan = bounds.east - bounds.west;
  return [
    ((point.lon - bounds.west) / lonSpan) * width,
    ((bounds.north - point.lat) / latSpan) * height,
  ];
}

export function worldLayerStyle(bounds: CropBounds): Record<string, string> {
  const latSpan = bounds.north - bounds.south;
  const lonSpan = bounds.east - bounds.west;
  return {
    "--world-w": `${(360 / lonSpan) * 100}%`,
    "--world-h": `${(180 / latSpan) * 100}%`,
    "--world-left": `${-((bounds.west + 180) / lonSpan) * 100}%`,
    "--world-top": `${-((90 - bounds.north) / latSpan) * 100}%`,
    "--map-aspect": `${lonSpan / latSpan}`,
  };
}
