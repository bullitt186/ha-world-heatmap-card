export type MapStyle = "dark" | "muted" | "contrast" | "light" | "grid";

export type CropMode =
  | "threats_xy"
  | "threats_lat"
  | "world"
  | "no_antarctica"
  | "temperate";

export type ScaleMode = "log" | "sqrt" | "linear";

export interface WorldHeatmapCardConfig {
  type: string;
  entity: string;
  title?: string;
  points_attribute?: string;
  max_attribute?: string;
  window_start_attribute?: string;
  window_end_attribute?: string;
  map_style?: MapStyle;
  crop?: CropMode;
  scale?: ScaleMode;
  radius?: number;
  blur?: number;
  opacity?: number;
  floor?: number;
  height?: number | string;
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
