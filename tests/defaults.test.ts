import { describe, expect, it } from "vitest";

import { DEFAULT_CONFIG, normalizeConfig } from "../src/defaults";

const minimal = { type: "custom:world-heatmap-card", entity: "sensor.attacks" };

describe("normalizeConfig", () => {
  it("fills in the defaults from the README options table", () => {
    expect(normalizeConfig(minimal)).toEqual({
      ...minimal,
      points_attribute: "points",
      map_style: "dark",
      crop: "tight_xy",
      scale: "log",
      color_theme: "default",
      radius: 24,
      blur: 14,
      opacity: 0.16,
      floor: 0.32,
      show_title: false,
      show_bounds: false,
    });
    expect(DEFAULT_CONFIG.crop).toBe("tight_xy");
  });

  it("keeps the options that are set", () => {
    const config = normalizeConfig({
      ...minimal,
      crop: "world",
      scale: "sqrt",
      title: "Attacks",
      radius: 30,
    });
    expect(config.crop).toBe("world");
    expect(config.scale).toBe("sqrt");
    expect(config.title).toBe("Attacks");
    expect(config.radius).toBe(30);
  });

  it("turns numeric options given as strings into numbers", () => {
    const config = normalizeConfig({
      ...minimal,
      radius: "12" as unknown as number,
      blur: "5" as unknown as number,
      opacity: "0.3" as unknown as number,
      floor: "0.1" as unknown as number,
    });
    expect([config.radius, config.blur, config.opacity, config.floor]).toEqual([12, 5, 0.3, 0.1]);
  });

  it("requires an entity", () => {
    expect(() => normalizeConfig({ type: "custom:world-heatmap-card", entity: "" })).toThrow(
      "World Heatmap Card requires an entity",
    );
  });
});
