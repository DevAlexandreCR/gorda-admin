---
name: project_service_origin_field
description: RTDB services have no explicit "origin" field; admin infers admin-vs-bot via a fragile created_by/wp_client_id heuristic that is being made explicit
metadata:
  type: project
---

The gorda-driver services model (RTDB `services/{id}` + SQL `service_history` table) has no
explicit field recording whether a service was created via the admin panel or the WhatsApp
bot. As of 2026-07-02 a plan is underway (not yet implemented) to add an explicit `origin`
field ('admin' | 'bot'), written by:
- `admin/src/repositories/ServiceRepository.ts` create() — alongside `created_by`
- `api/src/Services/chatBot/MessageStrategy/ResponseContract.ts` createService() — the bot's
  single confirmed service-creation call site
- Persisted to SQL via `api/src/Services/serviceHistory/ServiceHistoryMigrationService.ts`
  buildHistoryPayload(), which explicitly enumerates columns (adding a field there is
  mandatory — it will NOT pass through automatically).

**Key fact (verified, not assumption)**: `admin/src/models/Service.ts` constructor
unconditionally sets `this.wp_client_id = defaultClient` for EVERY service instance,
including admin-created ones. This means the existing UI heuristic (used in
ShowServiceModal.vue and ServicesTable.vue: "created_by present -> admin, else
wp_client_id present -> bot, else unknown") only works because `created_by` is checked
FIRST and is reliably set by admin's ServiceRepository.create() (line ~252). `wp_client_id`
alone is NOT a reliable bot-vs-admin signal — it's set on both sides.

**Why**: Matters for any future work touching service origin/provenance, reporting, or the
admin/api Service models — the "wp_client_id implies bot" assumption is a trap.

**How to apply**: When reviewing or implementing origin-related logic, verify precedence
order explicitly (created_by wins over wp_client_id) rather than trusting either field's
mere presence. Also: `functions/src/routes/services/controller.ts` (~line 465) only forwards
`serviceId` to `/internal/service-history/finalize`; the API re-reads the full RTDB record
via `ServiceRepository.findServiceById`, so new RTDB fields DO flow through to SQL finalize
automatically — the gap is only in `buildHistoryPayload`'s explicit column allowlist.

See [[project_gorda_multiservice_layout]] for overall repo structure.
