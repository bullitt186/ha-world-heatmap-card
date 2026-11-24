# Scope

What this project is for, so contributions go in the same direction. Changing this file is a
maintainer decision, recorded as an ADR in the same pull request (PR hygiene checks this).

## Purpose

Home Assistant users who have geographic activity data (for example network threats by origin
country) want to see it on a dashboard as a heatmap over a world map. This card renders such a
heatmap from any entity that exposes `{ lat, lon, value }` points, without a backend of its own
([README](../README.md)).

## In scope

- Rendering the points of one entity as a canvas heatmap over a static world map, with map
  styles, crop modes, intensity scaling and a visual editor ([Options](../README.md#options)).
- The bundled default map and heat renderer, and a custom map image per card.
- Installation through HACS (custom repository) and by hand.

## Out of scope

- Fetching or producing data: the card only reads the entity; integrations provide the points
  ([ADR-0002](adr/0002-generic-points-contract-and-bundled-renderer.md)).
- Integration-specific behaviour or names: the card stays generic for any data source (ADR-0002).
- Runtime loading from a CDN: the card must work in offline Home Assistant installations.
- Interactive maps (tiles, zoom, pan) or other projections: Open: to be decided by the maintainer.

## Direction

Open: to be decided by the maintainer. The README notes that the card is not in the default HACS
store yet.

## Principles

- One documented data contract: the `points` attribute.
- Everything the card needs is bundled.
- Readable defaults: log scale with an intensity floor, so low values stay visible.
