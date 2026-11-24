# ADR-0002: Generic points contract and bundled renderer

- **Status:** Accepted
- **Date:** 2026-11-24

## Context

Recorded after the fact from the README and [POC-NOTES.md](../POC-NOTES.md). The card was built
to show network threats by origin country from `ha-omada-open-api`, but the same view fits any
geographic data. A proof of concept showed that the heat layer only aligns with an
equirectangular map, that linear intensity lets a few locations dominate, and that a card loading
code from a CDN fails offline.

## Decision

The card reads exactly one entity whose `points` attribute is an array of `{ lat, lon, value }`
objects and ignores every other field; it calls no backend and fetches no data. Option names stay
generic (v0.2.0 renamed the threat-specific crop modes `threats_xy`/`threats_lat` to
`tight_xy`/`tight_lat`). `simpleheat` is bundled into the card, and the default map is a bundled
equirectangular image whose bounds the projection and the crop share. Intensity defaults to a log
scale with a normalised floor.

## Consequences

Any integration can feed the card by exposing the attribute; the card never needs a change for a
new data source. Changing the attribute contract or an option name is a breaking change. A
different map image must use the equirectangular projection to align.

## Alternatives considered

- Reading Omada threat entities directly: ties the card to one integration.
- Loading `simpleheat` or the map from a CDN: breaks offline Home Assistant installations.
