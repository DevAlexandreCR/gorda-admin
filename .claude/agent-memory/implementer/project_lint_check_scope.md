---
name: project-lint-check-scope
description: npm run lint-check scans ui_design/_ds_bundle.js which has hundreds of React/no-undef errors — always scope lint to changed files only
metadata:
  type: project
---

`npm run lint-check` scans the entire `src/` tree including `src/ui_design/_ds_bundle.js`, which generates hundreds of pre-existing React `no-undef` errors and causes the command to exit 1. These are not regressions.

**Why:** The ui_design/ directory is reference-render output checked into src/ but not excluded from ESLint.

**How to apply:** When validating changed files, scope the lint command directly to those files:
```
npx vue-cli-service lint --no-fix src/path/to/file.vue src/path/to/other.js
```
This gives a clean pass/fail signal without noise from ui_design. The full `npm run lint-check` is only meaningful if you want to audit pre-existing issues.
