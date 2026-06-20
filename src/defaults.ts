import type { WorldHeatmapCardConfig } from "./types";

export const DEFAULT_CONFIG = {
  points_attribute: "points",
  max_attribute: "max",
  window_start_attribute: "window_start",
  window_end_attribute: "window_end",
  map_style: "dark",
  crop: "threats_xy",
  scale: "log",
  radius: 24,
  blur: 14,
  opacity: 0.16,
  floor: 0.32,
  height: 360,
  show_title: false,
  show_bounds: false,
} satisfies Partial<WorldHeatmapCardConfig>;

export const DEFAULT_MAP_IMAGE_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/1280px-Equirectangular_projection_SW.jpg";

export function normalizeConfig(
  config: WorldHeatmapCardConfig,
): Required<Omit<WorldHeatmapCardConfig, "title" | "map_image_url">> &
  Pick<WorldHeatmapCardConfig, "title" | "map_image_url"> {
  if (!config.entity) {
    throw new Error("World Heatmap Card requires an entity");
  }

  return {
    ...DEFAULT_CONFIG,
    ...config,
    type: config.type,
    entity: config.entity,
    radius: Number(config.radius ?? DEFAULT_CONFIG.radius),
    blur: Number(config.blur ?? DEFAULT_CONFIG.blur),
    opacity: Number(config.opacity ?? DEFAULT_CONFIG.opacity),
    floor: Number(config.floor ?? DEFAULT_CONFIG.floor),
    height: config.height ?? DEFAULT_CONFIG.height,
  };
}
