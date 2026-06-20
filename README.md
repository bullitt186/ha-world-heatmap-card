# World Heatmap Card

Reusable Home Assistant custom card for rendering geographic activity as a
static world map with a canvas heatmap overlay.

The card is data-source agnostic. It reads a Home Assistant entity with a
`points` attribute containing `{ lat, lon, value }` objects.

## Development

```bash
npm install
npm run dev
```

Build the Home Assistant module:

```bash
npm run build
```

The build output is:

```text
dist/world-heatmap-card.js
```

When developed next to `ha-omada-open-api`, the existing devcontainer can mount
this `dist/` directory into Home Assistant. Use this dashboard resource:

```yaml
url: /local/ha-world-heatmap-card/world-heatmap-card.js
type: module
```

## Home Assistant Usage

```yaml
type: custom:world-heatmap-card
entity: sensor.omada_threat_heatmap_daily
map_style: dark
crop: threats_xy
scale: log
radius: 24
blur: 14
opacity: 0.16
floor: 0.32
height: 360
```

Normal dashboard view shows only the map and heatmap. Configuration controls
belong in the card editor, not in the rendered card.

## Data Shape

```json
{
  "points": [
    {
      "lat": 35,
      "lon": 105,
      "value": 23,
      "country": "CN"
    }
  ],
  "max": 435,
  "window_start": 1779397184,
  "window_end": 1781989184,
  "total_rows": 667
}
```

See [docs/SPEC.md](docs/SPEC.md) for the full specification.
