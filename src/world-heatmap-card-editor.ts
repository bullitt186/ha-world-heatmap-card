import { LitElement, html } from "lit";
import { state } from "lit/decorators.js";

import { DEFAULT_CONFIG } from "./defaults";
import { cardStyles } from "./styles";
import type { HomeAssistantLike, WorldHeatmapCardConfig } from "./types";

const SELECT_OPTIONS = {
  map_style: ["dark", "muted", "contrast", "light", "grid"],
  crop: ["tight_xy", "tight_lat", "world", "no_antarctica", "temperate"],
  scale: ["log", "sqrt", "linear"],
  color_theme: ["default", "reds", "yellows", "greens", "blues", "oranges", "purples"],
};

function selectOf(options: string[]) {
  return {
    select: { mode: "dropdown", options: options.map((value) => ({ value, label: value })) },
  };
}

export class WorldHeatmapCardEditor extends LitElement {
  static styles = cardStyles;

  @state()
  private config?: WorldHeatmapCardConfig;

  @state()
  private hass?: HomeAssistantLike;

  setConfig(config: WorldHeatmapCardConfig): void {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  protected render() {
    if (!this.config) return html``;

    return html`
      <div class="editor">
        ${this.selectorField("Entity", "entity", { entity: {} })}
        ${this.selectorField("Title", "title", { text: {} })}
        ${this.selectorField("Map style", "map_style", selectOf(SELECT_OPTIONS.map_style))}
        ${this.selectorField("Crop", "crop", selectOf(SELECT_OPTIONS.crop))}
        ${this.selectorField("Scale", "scale", selectOf(SELECT_OPTIONS.scale))}
        ${this.selectorField("Color theme", "color_theme", selectOf(SELECT_OPTIONS.color_theme))}
        ${this.selectorField("Radius", "radius", { number: { min: 4, max: 80, step: 1, mode: "slider" } })}
        ${this.selectorField("Blur", "blur", { number: { min: 0, max: 80, step: 1, mode: "slider" } })}
        ${this.selectorField("Opacity", "opacity", { number: { min: 0, max: 0.4, step: 0.01, mode: "slider" } })}
        ${this.selectorField("Floor", "floor", { number: { min: 0, max: 0.6, step: 0.01, mode: "slider" } })}
        ${this.selectorField("Map image URL", "map_image_url", { text: {} })}
        ${this.switchField("Show title", "show_title")}
        ${this.switchField("Show bounds", "show_bounds")}
      </div>
    `;
  }

  private selectorField(
    label: string,
    key: keyof WorldHeatmapCardConfig,
    selector: Record<string, unknown>,
  ) {
    return html`
      <ha-selector
        .hass=${this.hass}
        .selector=${selector}
        .value=${this.config?.[key] ?? ""}
        .label=${label}
        @value-changed=${(event: CustomEvent) =>
          this.updateConfig(key, event.detail.value)}
      ></ha-selector>
    `;
  }

  private switchField(label: string, key: keyof WorldHeatmapCardConfig) {
    return html`
      <label class="switch-row">
        <ha-switch
          .checked=${Boolean(this.config?.[key])}
          @change=${(event: Event) =>
            this.updateConfig(key, (event.target as HTMLInputElement).checked)}
        ></ha-switch>
        <span>${label}</span>
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
