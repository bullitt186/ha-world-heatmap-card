import worldMap from "./assets/world-map.jpg";

import type { WorldHeatmapCardConfig } from "./types";

export const DEFAULT_CONFIG = {
  points_attribute: "points",
  map_style: "dark",
  crop: "threats_xy",
  scale: "log",
  color_theme: "default",
  radius: 24,
  blur: 14,
  opacity: 0.16,
  floor: 0.32,
  show_title: false,
  show_bounds: false,
} satisfies Partial<WorldHeatmapCardConfig>;

export const DEFAULT_MAP_IMAGE_URL = worldMap;

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
  };
}
