---
name: admin-build-oom
description: npm run build in Docker may be OOM-killed (exit 137); use vue-tsc --noEmit for type validation
metadata:
  type: project
---

`npm run build` in the admin Docker container may exit 137 (OOM kill) during the webpack/vue-cli build phase. The Sass deprecation warnings shown before kill are all from third-party `soft-ui-dashboard` SCSS and are pre-existing.

**Why:** The container has limited memory and the full production build is memory-intensive.

**How to apply:** For type validation use `npx vue-tsc --noEmit` instead — it completes quickly and only reports two pre-existing tsconfig deprecation notices (not errors from source). For source-file lint validation, run eslint on individual files.
