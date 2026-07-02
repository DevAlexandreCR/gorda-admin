---
name: project_gorda_multiservice_layout
description: gorda-driver repo layout, service creation/persistence data flow for the services entity, and key file locations for cross-service review
metadata:
  type: project
---

gorda-driver is a 5-service ride-hailing platform: driver (Android/Kotlin), admin (Vue3 SPA,
this repo root when cwd=admin), functions (Firebase Functions TS), api (Node/Express/Sequelize),
dock (docker-compose). See root CLAUDE.md for full architecture; per-service `agents.md` files
(driver/agents.md, admin/agents.md, api/agents.md) have deeper guidance and MUST be read for
any non-trivial cross-service review.

**Services entity data flow** (relevant to any `services/{id}` RTDB change):
- Admin creates services via `admin/src/repositories/ServiceRepository.ts` create() — push()
  then a full `update()` re-write of the whole in-memory object (so any field set on the
  in-memory `Service` model instance before calling create() gets persisted).
- Bot/API creates services via `api/src/Services/chatBot/MessageStrategy/ResponseContract.ts`
  createService() — the only confirmed api-side creation call site (not exhaustively verified
  across the whole api/src tree; no grep tool was available in past reviews, treat as
  incomplete coverage until confirmed with a real search).
- Firebase RTDB status-change triggers live in `functions/src/routes/services/controller.ts`;
  on terminal status (terminated/canceled) it POSTs only `{serviceId}` to
  `/internal/service-history/finalize` on the api — the api re-reads the FULL record from RTDB
  before persisting to SQL, so new RTDB fields flow through automatically.
- SQL persistence goes through `api/src/Services/serviceHistory/ServiceHistoryMigrationService.ts`
  buildHistoryPayload(), which explicitly allowlists columns — new fields must be added here
  manually, they do NOT pass through automatically. Model: `api/src/Models/ServiceHistoryRecord.ts`.

**Reviewer tooling constraint**: subagent instances reviewing this repo have sometimes lacked
shell/grep access (Read-only file tool only) — when this happens, explicitly flag "exhaustive
search not possible" for claims like "is this the only call site" rather than asserting false
completeness.

See [[project_service_origin_field]] for a concrete example of this data flow being extended.
