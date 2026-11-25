# Changelog

All notable changes are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions: [SemVer](https://semver.org/).

## [Unreleased]

### Changed

- The heatmap is drawn with simpleheat 1.0 (was 0.4). It reads the canvas size on every draw and
  skips drawing while the card is hidden, instead of failing on a zero-sized canvas. The map looks
  the same.
- Contributing: one setup for people and coding agents from
  [repo-kit](https://github.com/bullitt186/repo-kit). `CONTRIBUTING.md` has the Definition of Done
  every pull request is reviewed against, `docs/SCOPE.md` says what belongs in the project, and
  feature work starts from an issue the maintainer has labelled `accepted`. New checks on pull
  requests: `PR hygiene`, a secret scan and dependency review; Dependabot proposes npm and GitHub
  Actions updates weekly. Nothing changes for users of the card.
- Contributing: unit tests (vitest) for the crop bounds, the equirectangular projection, the
  config defaults and the point scaling; oxlint and Prettier check the code. CI and the release
  quality gate run them, and the workflows have read-only token permissions and pinned actions.
  The source was reformatted by Prettier; the built card is byte-for-byte the same.
- Contributing: mutation testing with Stryker, `npm run mutate` for changed files and a weekly run
  that reports the score without blocking pull requests. Nothing changes for users of the card.

### Security

- Development dependencies: `package.json` `overrides` lift `qs` to 6.17 and `minimatch` to 11, which
  Stryker pulls in transitively at versions with known advisories. Dependabot could not update them
  because their parents pin exact versions. Nothing changes for users of the card.

## [0.2.0] - 2026-06-21

### Changed

- Crop modes renamed: `threats_xy` → `tight_xy`, `threats_lat` → `tight_lat`. The new names
  describe the behaviour (crop tightly around the data).
- README credits [simpleheat](https://github.com/mourner/simpleheat) (BSD-2-Clause) and notes
  that the card pairs with ha-omada-open-api but works with any entity exposing points.

### Upgrade notes

- Update `crop:` in existing card YAML to the new names.
