import { LitElement, html, nothing } from "lit";
import { state } from "lit/decorators.js";

import { DEFAULT_MAP_IMAGE_URL, normalizeConfig } from "./defaults";
import { HeatmapRenderer } from "./heatmap-renderer";
import { cardStyles } from "./styles";
import type {
  CropBounds,
  HeatmapPoint,
  HomeAssistantLike,
  WorldHeatmapCardConfig,
} from "./types";
import "./world-heatmap-card-editor";
import { worldLayerStyle } from "./projection";

declare global {
  interface Window {
    customCards?: Array<Record<string, string>>;
  }
}

export class WorldHeatmapCard extends LitElement {
  static styles = cardStyles;

  @state()
  private config?: ReturnType<typeof normalizeConfig>;

  @state()
  private _hass?: HomeAssistantLike;

  @state()
  private bounds?: CropBounds;

  private canvas?: HTMLCanvasElement;
  private map?: HTMLElement;
  private renderer?: HeatmapRenderer;
  private resizeObserver?: ResizeObserver;

  setConfig(config: WorldHeatmapCardConfig): void {
    this.config = normalizeConfig(config);
  }

  set hass(value: HomeAssistantLike) {
    this._hass = value;
    this.updateComplete.then(() => this.draw());
  }

  getCardSize(): number {
    return 4;
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("world-heatmap-card-editor");
  }

  static getStubConfig(): Partial<WorldHeatmapCardConfig> {
    return {
      type: "custom:world-heatmap-card",
      map_style: "dark",
      crop: "threats_xy",
      scale: "log",
    };
  }

  disconnectedCallback(): void {
    this.resizeObserver?.disconnect();
    super.disconnectedCallback();
  }

  protected firstUpdated(): void {
    this.canvas = this.renderRoot.querySelector("canvas") ?? undefined;
    this.map = this.renderRoot.querySelector(".map") ?? undefined;
    if (this.canvas) {
      this.renderer = new HeatmapRenderer(this.canvas);
    }
    if (this.map) {
      this.resizeObserver = new ResizeObserver(() => this.draw());
      this.resizeObserver.observe(this.map);
    }
    this.draw();
  }

  protected updated(): void {
    this.draw();
  }

  protected render() {
    if (!this.config) return nothing;
    const stateObj = this._hass?.states[this.config.entity];
    const points = this.getPoints();
    const mapImage = this.config.map_image_url ?? DEFAULT_MAP_IMAGE_URL;

    return html`
      <ha-card>
        ${this.config.show_title && this.config.title
          ? html`<div class="title">${this.config.title}</div>`
          : nothing}
        <div
          class="map map-style-${this.config.map_style}"
          style=${this.styleText({
            "--map-image": `url("${mapImage}")`,
            ...(this.bounds ? worldLayerStyle(this.bounds) : {}),
          })}
        >
          <canvas></canvas>
          ${!stateObj
            ? html`<div class="message">Entity not found: ${this.config.entity}</div>`
            : nothing}
          ${stateObj && !points.length
            ? html`<div class="message">No heatmap points available</div>`
            : nothing}
        </div>
        ${this.config.show_bounds && this.bounds
          ? html`<div class="bounds">
              Bounds: ${this.bounds.south.toFixed(1)} to
              ${this.bounds.north.toFixed(1)} lat,
              ${this.bounds.west.toFixed(1)} to ${this.bounds.east.toFixed(1)}
              lon
            </div>`
          : nothing}
      </ha-card>
    `;
  }

  private draw(): void {
    if (!this.config || !this.canvas || !this.map || !this.renderer) return;

    const rect = this.map.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const nextWidth = Math.max(1, Math.round(rect.width * dpr));
    const nextHeight = Math.max(1, Math.round(rect.height * dpr));
    if (this.canvas.width !== nextWidth || this.canvas.height !== nextHeight) {
      this.canvas.width = nextWidth;
      this.canvas.height = nextHeight;
    }

    const nextBounds = this.renderer.render(this.getPoints(), {
      blur: this.config.blur,
      colorTheme: this.config.color_theme,
      crop: this.config.crop,
      floor: this.config.floor,
      opacity: this.config.opacity,
      radius: this.config.radius * dpr,
      scale: this.config.scale,
    });
    if (!this.sameBounds(this.bounds, nextBounds)) {
      this.bounds = nextBounds;
    }
  }

  private getPoints(): HeatmapPoint[] {
    if (!this.config || !this._hass) return [];
    const stateObj = this._hass.states[this.config.entity];
    const value = stateObj?.attributes[this.config.points_attribute];
    if (!Array.isArray(value)) return [];
    return value
      .map((point) => ({
        ...(point as Record<string, unknown>),
        lat: Number((point as Record<string, unknown>).lat),
        lon: Number((point as Record<string, unknown>).lon),
        value: Number((point as Record<string, unknown>).value),
      }))
      .filter(
        (point) =>
          Number.isFinite(point.lat) &&
          Number.isFinite(point.lon) &&
          Number.isFinite(point.value),
      ) as HeatmapPoint[];
  }

  private styleText(values: Record<string, string>): string {
    return Object.entries(values)
      .map(([key, value]) => `${key}: ${value}`)
      .join("; ");
  }

  private sameBounds(left?: CropBounds, right?: CropBounds): boolean {
    return (
      !!left &&
      !!right &&
      left.north === right.north &&
      left.south === right.south &&
      left.west === right.west &&
      left.east === right.east
    );
  }
}

if (!customElements.get("world-heatmap-card")) {
  customElements.define("world-heatmap-card", WorldHeatmapCard);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "world-heatmap-card",
  name: "World Heatmap Card",
  description: "Render geographic activity as a world heatmap",
});
