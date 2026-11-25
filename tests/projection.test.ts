import { describe, expect, it } from "vitest";

import { cropBounds, projectPoint, worldLayerStyle } from "../src/projection";
import type { CropBounds } from "../src/types";

const WORLD: CropBounds = { north: 90, south: -90, west: -180, east: 180 };
const point = (lat: number, lon: number, value = 1) => ({ lat, lon, value });

describe("cropBounds", () => {
  it("returns fixed bounds for the fixed crop modes", () => {
    expect(cropBounds([], "world")).toEqual(WORLD);
    expect(cropBounds([], "no_antarctica")).toEqual({
      north: 85,
      south: -60,
      west: -180,
      east: 180,
    });
    expect(cropBounds([], "temperate")).toEqual({ north: 70, south: -55, west: -180, east: 180 });
  });

  it("tight_xy pads the data by 7 degrees latitude and 12 degrees longitude", () => {
    const points = [point(48.1, 11.6), point(40.7, -74.0)];
    expect(cropBounds(points, "tight_xy")).toEqual({
      north: 48.1 + 7,
      south: 40.7 - 7,
      west: -74.0 - 12,
      east: 11.6 + 12,
    });
  });

  it("tight_lat crops latitude only and keeps the full longitude range", () => {
    const points = [point(48.1, 11.6), point(40.7, -74.0)];
    expect(cropBounds(points, "tight_lat")).toEqual({
      north: 55.1,
      south: 33.7,
      west: -180,
      east: 180,
    });
  });

  it("clamps the tight crops to 85 N, 60 S and the date line", () => {
    const points = [point(84, 175), point(-59, -175)];
    expect(cropBounds(points, "tight_xy")).toEqual({
      north: 85,
      south: -60,
      west: -180,
      east: 180,
    });
  });

  it("ignores coordinates that are not finite, per axis", () => {
    // The latitude NaN drops out of the latitude range only; its longitude still counts.
    const points = [point(10, 20), point(Number.NaN, 100), point(30, Number.POSITIVE_INFINITY)];
    expect(cropBounds(points, "tight_xy")).toEqual({ north: 37, south: 3, west: 8, east: 112 });
  });

  it("falls back to the no_antarctica bounds without usable points", () => {
    expect(cropBounds([], "tight_xy")).toEqual({ north: 85, south: -60, west: -180, east: 180 });
    expect(cropBounds([point(Number.NaN, 0)], "tight_lat")).toEqual({
      north: 85,
      south: -60,
      west: -180,
      east: 180,
    });
  });
});

describe("projectPoint (equirectangular)", () => {
  it("maps longitude and latitude linearly to x and y", () => {
    expect(projectPoint(point(90, -180), WORLD, 360, 180)).toEqual([0, 0]);
    expect(projectPoint(point(0, 0), WORLD, 360, 180)).toEqual([180, 90]);
    expect(projectPoint(point(-90, 180), WORLD, 360, 180)).toEqual([360, 180]);
    expect(projectPoint(point(45, 90), WORLD, 720, 360)).toEqual([540, 90]);
  });

  it("projects into the cropped bounds", () => {
    const bounds = { north: 60, south: 40, west: 0, east: 20 };
    expect(projectPoint(point(50, 10), bounds, 200, 100)).toEqual([100, 50]);
    expect(projectPoint(point(60, 0), bounds, 200, 100)).toEqual([0, 0]);
  });
});

describe("worldLayerStyle", () => {
  it("shows the whole map unscaled for the world bounds", () => {
    expect(worldLayerStyle(WORLD)).toEqual({
      "--world-w": "100%",
      "--world-h": "100%",
      "--world-left": "0%",
      "--world-top": "0%",
      "--map-aspect": "2",
    });
  });

  it("scales and shifts the map so the crop fills the card", () => {
    // 90 x 45 degrees: the 360 x 180 map is 4 times as wide and high as the card.
    const style = worldLayerStyle({ north: 45, south: 0, west: 0, east: 90 });
    expect(style["--world-w"]).toBe("400%");
    expect(style["--world-h"]).toBe("400%");
    expect(style["--world-left"]).toBe("-200%"); // 180 degrees west of the crop
    expect(style["--world-top"]).toBe("-100%"); // 45 degrees north of the crop
    expect(style["--map-aspect"]).toBe("2");
  });
});
