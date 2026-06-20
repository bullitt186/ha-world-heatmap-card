import { LitElement, html } from "lit";
import { state } from "lit/decorators.js";

import { DEFAULT_CONFIG } from "./defaults";
import { cardStyles } from "./styles";
import type { HomeAssistantLike, WorldHeatmapCardConfig } from "./types";

const SELECT_OPTIONS = {
  map_style: ["dark", "muted", "contrast", "light", "grid"],
  crop: ["threats_xy", "threats_lat", "world", "no_antarctica", "temperate"],
  scale: ["log", "sqrt", "linear"],
};

export class WorldHeatmapCardEditor extends LitElement {
  static styles = cardStyles;

  @state()
  private config?: WorldHeatmapCardConfig;

  setConfig(config: WorldHeatmapCardConfig): void {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  set hass(_value: HomeAssistantLike) {
    // Kept for Home Assistant editor lifecycle compatibility.
  }

  protected render() {
    if (!this.config) return html``;

    return html`
      <div class="editor">
        ${this.textField("Entity", "entity")}
        ${this.textField("Title", "title")}
        ${this.selectField("Map style", "map_style", SELECT_OPTIONS.map_style)}
        ${this.selectField("Crop", "crop", SELECT_OPTIONS.crop)}
        ${this.selectField("Scale", "scale", SELECT_OPTIONS.scale)}
        ${this.numberField("Radius", "radius", 4, 80, 1)}
        ${this.numberField("Blur", "blur", 0, 80, 1)}
        ${this.numberField("Opacity", "opacity", 0, 0.4, 0.01)}
        ${this.numberField("Floor", "floor", 0, 0.6, 0.01)}
        ${this.textField("Height", "height")}
        ${this.textField("Map image URL", "map_image_url")}
        ${this.checkboxField("Show title", "show_title")}
        ${this.checkboxField("Show bounds", "show_bounds")}
      </div>
    `;
  }

  private textField(label: string, key: keyof WorldHeatmapCardConfig) {
    return html`
      <div class="field">
        <label>${label}</label>
        <input
          .value=${String(this.config?.[key] ?? "")}
          @input=${(event: Event) =>
            this.updateConfig(key, (event.target as HTMLInputElement).value)}
        />
      </div>
    `;
  }

  private numberField(
    label: string,
    key: keyof WorldHeatmapCardConfig,
    min: number,
    max: number,
    step: number,
  ) {
    return html`
      <div class="field">
        <label>${label}</label>
        <input
          type="number"
          min=${min}
          max=${max}
          step=${step}
          .value=${String(this.config?.[key] ?? "")}
          @input=${(event: Event) =>
            this.updateConfig(key, Number((event.target as HTMLInputElement).value))}
        />
      </div>
    `;
  }

  private selectField(
    label: string,
    key: keyof WorldHeatmapCardConfig,
    options: string[],
  ) {
    return html`
      <div class="field">
        <label>${label}</label>
        <select
          .value=${String(this.config?.[key] ?? "")}
          @change=${(event: Event) =>
            this.updateConfig(key, (event.target as HTMLSelectElement).value)}
        >
          ${options.map(
            (option) => html`<option value=${option}>${option}</option>`,
          )}
        </select>
      </div>
    `;
  }

  private checkboxField(label: string, key: keyof WorldHeatmapCardConfig) {
    return html`
      <label>
        <input
          type="checkbox"
          .checked=${Boolean(this.config?.[key])}
          @change=${(event: Event) =>
            this.updateConfig(key, (event.target as HTMLInputElement).checked)}
        />
        ${label}
      </label>
    `;
  }

  private updateConfig(key: keyof WorldHeatmapCardConfig, value: unknown): void {
    if (!this.config) return;
    const nextConfig = { ...this.config, [key]: value };
    this.config = nextConfig;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: true,
        composed: true,
        detail: { config: nextConfig },
      }),
    );
  }
}

if (!customElements.get("world-heatmap-card-editor")) {
  customElements.define("world-heatmap-card-editor", WorldHeatmapCardEditor);
}
