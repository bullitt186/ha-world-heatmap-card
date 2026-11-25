#!/usr/bin/env bash
# Mutation testing with Stryker (stryker.config.json) of the source files changed against
# origin/main. `npm run mutate:all` mutates all of src/ (the weekly workflow does that).
# MUTATE_BASE overrides the base. The report is in reports/mutation/mutation.html.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
base=$(git merge-base "${MUTATE_BASE:-origin/main}" HEAD)
files=$({ git diff --name-only "$base" -- 'src/*.ts'; git ls-files --others --exclude-standard -- 'src/*.ts'; } \
    | grep -vE '\.d\.ts$|^src/styles\.ts$' | sort -u | paste -sd, - || true)
if [ -z "$files" ]; then
    echo "No source files changed against ${MUTATE_BASE:-origin/main}; nothing to mutate."
    exit 0
fi
echo "Mutating: $files"
exec npx stryker run --mutate "$files"
