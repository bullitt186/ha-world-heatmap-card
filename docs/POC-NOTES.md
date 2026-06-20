# POC Notes

Reference POC:

```text
../ha-omada-open-api/poc/threat-heatmap/
```

Key implementation lessons from the POC:

- Use an equirectangular/Plate-Carree world map image. Other projections will
  not align with the simple lon/lat projection.
- The heatmap projection and map crop must use the same bounds.
- The map container must use `overflow: hidden`; otherwise cropped map layers
  remain visible outside the intended viewport.
- Raw linear heat intensity makes high-volume locations dominate. Default to
  log scale.
- Add a normalized intensity floor so low-volume countries remain visible.
- Keep normal card rendering clean: no tuning controls and no right-hand data
  panel.
- Keep `simpleheat` bundled into the card. Do not load it from a CDN in the
  Home Assistant card.

The POC validated the visual model with Omada Threat Management data, but the
card must stay generic and only depend on the documented `points` attribute
contract.
