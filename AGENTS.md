# AGENTS.md

<!-- repo-kit:begin v2 (managed, do not edit; https://github.com/bullitt186/repo-kit) -->
## How to work in this repository (all coding agents)

This block is shared by all repositories of this maintainer and kept in sync by
[repo-kit](https://github.com/bullitt186/repo-kit). Repository-specific
instructions follow below it. They add detail; where they contradict this block,
this block wins, unless an ADR in `docs/adr/` records the exception.

A pull request that follows this block passes review without rework. The
maintainer reviews against the same rules: the **Definition of Done** in
`CONTRIBUTING.md`.

### Build the right thing

1. Read this file to the end, `CONTRIBUTING.md`, `docs/SCOPE.md` and the
   architecture decision records in `docs/adr/` (start with `docs/adr/README.md`).
   An *Accepted* ADR and the scope are binding. If your change needs a different
   decision, write a new ADR that supersedes the old one, in the same pull request.
2. Work from an issue. A feature or behaviour change needs an issue the maintainer
   has labelled `accepted`; if there is none, open one, describe the problem (not
   only the solution) and wait. Only a **small fix** may skip the issue: it repairs
   documented behaviour, changes fewer than about 50 lines of code, and adds no
   dependency, interface, setting or file format.
3. Build what the issue asks for and nothing else. Ideas you have on the way become
   a new issue, not part of this pull request. No reformatting, renaming or
   refactoring that the change does not need.
4. Prefer the smallest complete change: reuse what the repository already has
   (helpers, patterns, dependencies) before adding anything; no new dependency for
   a few lines. Fix the root cause, not the symptom.
5. Never guess protocol values, API fields or hardware behaviour. Take them from a
   source and name it; mark anything unconfirmed as an assumption.

### Design first

Write the design down before the code: the behaviour that changes, the modules
and interfaces involved, and how it is tested. Put it in the issue or the pull
request description; for a small change the commit message is enough.

Write an ADR (`docs/adr/`, see its README) when the change:

- adds, removes or replaces a runtime dependency or external service,
- changes a public interface: API, CLI, configuration keys, file or data formats,
  entity or topic names, anything users or other systems rely on,
- changes the architecture: module boundaries, data flow, persistence, threading,
- sets a security, privacy or compatibility rule,
- reverses or replaces an earlier ADR, or changes `docs/SCOPE.md`.

Bug fixes and refactorings inside existing decisions need no ADR.

### Tests

Design the test cases from the specification, then implement the change together
with them. A one-test-at-a-time red/green cycle is not required.

- A bug fix starts with a regression test that reproduces the bug. Run it and
  confirm it fails **for the reason the bug describes**, not because of a build,
  import or signature error. Then fix the bug and commit the test with the fix.
- Expected values come from the specification: documentation, a protocol table,
  a manual, the issue, or a recorded real payload. Never from running the code
  under test and copying its output; such a test only proves the code does what
  it does.
- Assert observable results (output, state, sent request, raised error), not only
  that something was called.
- Tests are fast, deterministic and offline. A flaky test is a bug to fix, not to
  re-run.
- Changing an expected value in an existing test needs a reason in the commit
  message that names the source of the new value.
- Coverage shows what ran, not whether a test notices a wrong result. Run mutation
  testing on the code you changed (see Commands below); kill a surviving mutant
  with a test, or say in the pull request why it is equivalent.
- Do not weaken lint rules, thresholds or checks to make a change pass; fix the
  code. A justified exception gets a comment next to it and a note in the commit
  message. Thresholds are only ever raised.

### Documentation

Documentation changes in the same pull request as the behaviour it describes:
README, `docs/`, configuration examples, the ADRs and `CHANGELOG.md`. Outdated
documentation counts as a bug. Relative links in Markdown must point to files
that exist.

Changelog entries go under `[Unreleased]`, in the Keep a Changelog sections
(Added, Changed, Fixed, Removed, Security). Write them for the user of the
project: what changes for them and what they have to do, not which functions
moved. A breaking change gets an entry under "Upgrade notes" with the steps.
Name outside contributors and link their issue or pull request. Releases, tags
and version numbers are the maintainer's
([release standard](https://github.com/bullitt186/repo-kit/blob/main/docs/RELEASING.md)).

### Commits and branches

- One branch per topic from the current default branch; never commit to the
  default branch. Agents working in parallel use their own git worktree; never
  run checkout, switch, reset, stash or clean in a checkout someone else uses.
- Commit each completed step with a Conventional Commits message (`feat:`,
  `fix:`, `docs:`, `test:`, `refactor:`, `chore:`, `ci:`); the body says why.
  Code, comments, commit messages and pull requests are in English.
- Reference the issue: `Closes #N` on GitHub; `Refs #N` on Forgejo, which closes
  an issue as soon as a commit with `Closes` is pushed.
- Never commit or push on red; never use `--no-verify` or skip hooks; treat every
  hook finding as work to do.

### Before you open the pull request

- Run the repository's **fast check** before every commit and the **full check**
  when your change can affect what it covers (see Commands below). Both must pass.
- Merge or rebase onto the current default branch and run the checks again.
- Fill in the pull request template completely; tick only what you did and say
  why anything stays unticked.
- After pushing, watch CI yourself. A red check on your pull request is your work,
  also when it looks unrelated.
- No secrets, tokens, personal data, local paths, host names or IP addresses in
  code, tests, fixtures, logs, commits or pull request text.

### Continuous integration

CI follows the repo-kit [CI standard](https://github.com/bullitt186/repo-kit/blob/main/docs/CI_STANDARD.md):
tests, lint and format, type check, build, secret scan, dependency review, static
analysis and `PR hygiene`. PR hygiene fails when code changes come without a test
change or a `CHANGELOG.md` entry, when `docs/SCOPE.md` changes without an ADR,
when an ADR is malformed or missing from the index, when a changed Markdown file
has a broken relative link, when code from an outside contributor links no issue,
or when a pull request changes more than about 800 lines of code and tests. Only
the maintainer can waive a rule (labels `no-test-change`, `skip-changelog`,
`large-change`). Do not ask for a waiver when a test, entry or split is possible.

### Respect

Do not change CI configuration, branch protection, release workflows, licence,
`docs/SCOPE.md` or this block unless the issue asks for it. Maintainer decisions
recorded in issues and ADRs are not up for silent change.
<!-- repo-kit:end -->

## This repository

### Purpose

Scope and non-goals: [docs/SCOPE.md](docs/SCOPE.md).

A Home Assistant Lovelace custom card, written in TypeScript with Lit, that draws a canvas heatmap
of geographic points over a static world map. It reads one entity whose `points` attribute holds
`{ lat, lon, value }` objects and fetches no data itself. It is installed through HACS (custom
repository) or by hand; see the [README](README.md).

### Layout

| Path | Content |
|---|---|
| `src/world-heatmap-card.ts` | the card element: configuration, reading the entity, rendering |
| `src/world-heatmap-card-editor.ts` | the visual editor (native Home Assistant selectors) |
| `src/heatmap-renderer.ts`, `src/projection.ts` | heat rendering (bundled `simpleheat`) and the lon/lat projection and crop |
| `src/defaults.ts`, `src/styles.ts`, `src/types.ts` | default options, map styles and CSS, types |
| `src/assets/` | the bundled default world map (equirectangular) |
| `docs/` | scope, decisions (`adr/`), POC lessons (`POC-NOTES.md`), README screenshots |
| `.github/workflows/` | CI (type check and build), release on `v*` tags, PR hygiene, security |

The build output `dist/world-heatmap-card.js` is not committed; the release workflow attaches it.

### Commands

| Task | Command |
|---|---|
| Install / set up | Node.js LTS and `npm ci` |
| Fast check (before every commit, also the stop hook) | `npm run typecheck && npm run lint && npm test && npm run build` (tsc, oxlint and Prettier in check mode, vitest, vite build) |
| Full check | same as the fast check; `npm run test:coverage` adds the coverage report CI prints. `npm run format` rewrites the formatting |
| Mutation testing of changed code | not set up: there are no tests to measure yet ([#1](https://github.com/bullitt186/ha-world-heatmap-card/issues/1)) |

`npm run dev` serves the card locally for manual checks.

### Rules specific to this repository

- The card stays generic: it depends only on the documented `points` attribute contract
  ([README](README.md#data-shape), [ADR-0002](docs/adr/0002-generic-points-contract-and-bundled-renderer.md)),
  never on a particular integration.
- `simpleheat` stays bundled into the card; never load code or the map from a CDN at runtime.
- Lint is oxlint (`.oxlintrc.json`) rather than ESLint: TypeScript 7 ships no JavaScript API, which
  typescript-eslint needs (it supports TypeScript 7 only from 7.1). Prettier leaves the CSS and
  HTML inside Lit templates as written (`embeddedLanguageFormatting: off`).
- Tests (`tests/`, vitest) replace `simpleheat` with a fake that records the points, so they run
  without a canvas; expected values come from the README options and the equirectangular projection.
- The map image and the projection use the same equirectangular bounds; keep `overflow: hidden`
  on the map container (lessons in [docs/POC-NOTES.md](docs/POC-NOTES.md)).
- Configuration option names are a public interface: renaming one is a breaking change with
  upgrade notes (see the `crop` rename in v0.2.0).
- Releases follow the repo-kit
  [release standard](https://github.com/bullitt186/repo-kit/blob/main/docs/RELEASING.md). The
  release pull request sets `version` in `package.json` (the release workflow rejects a tag that
  does not match it), moves `[Unreleased]` in `CHANGELOG.md` to the version, and writes
  `RELEASE_NOTES.md` for that version in the standard's release-notes structure; the workflow
  publishes it as the release body and attaches the built `dist/world-heatmap-card.js`.
- Until tests exist, a behaviour change states in the pull request how it was checked (for
  example `npm run dev` with a sample entity, or a Home Assistant dashboard).
