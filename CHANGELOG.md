# Changelog

All notable changes are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions: [SemVer](https://semver.org/).

## [Unreleased]

### Changed

- Contributing: one setup for people and coding agents from
  [repo-kit](https://github.com/bullitt186/repo-kit). `CONTRIBUTING.md` has the Definition of Done
  every pull request is reviewed against, `docs/SCOPE.md` says what belongs in the project, and
  feature work starts from an issue the maintainer has labelled `accepted`. New checks on pull
  requests: `PR hygiene`, a secret scan and dependency review; Dependabot proposes npm and GitHub
  Actions updates weekly. Nothing changes for users of the card.

## [0.2.0] - 2026-06-21

### Changed

- Crop modes renamed: `threats_xy` → `tight_xy`, `threats_lat` → `tight_lat`. The new names
  describe the behaviour (crop tightly around the data).
- README credits [simpleheat](https://github.com/mourner/simpleheat) (BSD-2-Clause) and notes
  that the card pairs with ha-omada-open-api but works with any entity exposing points.

### Upgrade notes

- Update `crop:` in existing card YAML to the new names.
