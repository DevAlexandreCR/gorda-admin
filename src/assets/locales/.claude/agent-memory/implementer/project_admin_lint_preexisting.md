---
name: admin-lint-preexisting-failures
description: npm run lint-check always fails on ui_design/_ds_bundle.js (React errors) — not related to Vue source changes
metadata:
  type: project
---

`npm run lint-check` in the admin service always exits non-zero due to hundreds of `'React' is not defined` errors in `src/ui_design/_ds_bundle.js`. This file is a reference render bundle and is excluded from production builds. Pre-existing warnings also exist in InteractiveMessageBuilder.vue and History.vue (non-null assertions).

**Why:** The ui_design directory is reference-only and was not added to .eslintignore, so the global lint sweep picks it up.

**How to apply:** When validating changed files, run `npx eslint <file1> <file2>` directly on the modified files instead of `npm run lint-check`. This gives a clean signal for the actual changes.
