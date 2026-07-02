---
name: project-admin-container-oom
description: admin Docker container can be OOM-killed (exit 137) during npm run build or jest runs — use vue-tsc --noEmit for type validation and read jest output for PASS/FAIL before trusting the exit code
metadata:
  type: project
---

The `admin` Docker container has limited memory. Both `npm run build` and `npx jest <spec>` can trigger an OOM kill (exit 137) during the build/teardown phase, even when the actual build or test suite completed and reported PASS/success just before the kill. When this happens the container itself may stop and need `docker compose up -d admin` again before running more commands in it.

**Why:** Webpack/vue-cli production builds and Jest's process teardown are memory-intensive relative to the container's memory limit; this is an infra constraint, not a code regression.

**How to apply:**
- For Jest: read the output for `PASS`/`FAIL` lines rather than trusting only the shell exit code — a `PASS` followed by exit 137 means the tests passed and the container was killed afterward during cleanup.
- For type validation, prefer `npx vue-tsc --noEmit -p tsconfig.json` over a full `npm run build` — it's fast and low-memory. Expect exactly two pre-existing deprecation notices (TS5107 `moduleResolution=node10`, TS5101 `baseUrl`) from `tsconfig.json` itself — not source errors.
- If a command fails with "service admin is not running" right after an OOM, run `docker compose up -d admin` from `/Users/alexandrecr/devs/gorda/gorda-driver/dock` and retry.
- Related: [[project_lint_check_scope]] for scoping ESLint to changed files only.
