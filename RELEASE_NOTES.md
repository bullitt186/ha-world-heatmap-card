## What's New in v0.2.0

### Breaking Changes

- Renamed crop modes `threats_xy` → `tight_xy` and `threats_lat` → `tight_lat`. The old names were specific to a threat-monitoring use case; the new names describe the actual behavior (crop tightly around the data). Update `crop:` in any existing card YAML.

### Other Changes

- README now credits [simpleheat](https://github.com/mourner/simpleheat) (BSD-2-Clause) for heat point rendering.
- README notes the card was designed to pair with [ha-omada-open-api](https://github.com/bullitt186/ha-omada-open-api) for a network-threats-by-country heatmap, while remaining usable with any entity exposing geographic points.
