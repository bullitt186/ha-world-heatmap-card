export type MapStyle = "dark" | "muted" | "contrast" | "light" | "grid";

export type CropMode =
  | "tight_xy"
  | "tight_lat"
  | "world"
  | "no_antarctica"
  | "temperate";

export type ScaleMode = "log" | "sqrt" | "linear";

export type ColorTheme =
  | "default"
  | "reds"
  | "yellows"
  | "greens"
  | "blues"
  | "oranges"
  | "purples";

export interface WorldHeatmapCardConfig {
  type: string;
  entity: string;
  title?: string;
  points_attribute?: string;
  map_style?: MapStyle;
  crop?: CropMode;
  scale?: ScaleMode;
  color_theme?: ColorTheme;
  radius?: number;
  blur?: number;
  opacity?: number;
  floor?: number;
  show_title?: boolean;
  show_bounds?: boolean;
  map_image_url?: string;
}

export interface HeatmapPoint {
  lat: number;
  lon: number;
  value: number;
  country?: string;
  label?: string;
  sample_ips?: string[];
  top_signatures?: [string, number][];
  top_activities?: [string, number][];
  severities?: Record<string, number>;
  latest_time?: number;
}

export interface CropBounds {
  north: number;
  south: number;
  west: number;
  east: number;
}

export interface HomeAssistantLike {
  states: Record<string, { state: string; attributes: Record<string, unknown> }>;
}
