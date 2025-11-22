# Gorda Admin – Agents Guide

This document summarizes the current codebase so autonomous agents can execute tasks with the right context.

## Codebase Review Highlights
- Vue 3 + TypeScript SPA served from `src/` with Pinia stores, Bootstrap 5 UI, and Composition API in `<script setup>` format.
- Data spans Firebase Realtime Database, Firestore, and an external Node/Express API (`VUE_APP_GORDA_API_URL`). Socket.IO (`VUE_APP_WP_CLIENT_API_URL`) handles WhatsApp clients.
- Repository pattern (`src/repositories/`) centralizes all data access. Stores in `src/services/stores/` subscribe to these repositories for live updates and caching.
- WhatsApp workflows rely on singleton Socket.IO clients plus Firestore message collections; changes here risk breaking multi-number "coexistence" mode.
- Testing uses Jest + Vue Test Utils with configs in `jest.config.js`, `jest.setup.js`, and `tests/unit/**`. ESLint enforces Vue + TS rules.

## Architecture Overview
1. **Frontend Shell** – `src/main.ts` bootstraps Vue, Pinia, router, i18n, and global styles. Reusable components live in `src/components/`, views in `src/views/`.
2. **State & Data** – Pinia stores under `src/services/stores/` wrap repository calls, expose computed getters, and register real-time listeners (`onChildAdded`, `onSnapshot`).
3. **Repositories** – `src/repositories/*.ts` encapsulate Firebase RTDB/Firestore queries plus Axios calls to the privileged API. Many entities (e.g., services) combine Firestore pagination with RTDB mirrors.
4. **Service Layer** – `src/services/` contains Firebase initializers (`DBService`, `FSService`, `AuthService`), Toast/Facebook helpers, WhatsApp client, and API abstractions in `gordaApi/`.
5. **Types & Models** – `src/types/` defines DTO-style interfaces; `src/models/` adds computed helpers or class logic. Constants reside in `src/constants/` to keep enums/config centralized.
6. **Routing & Guards** – `src/router/` includes dynamic route definitions plus guards enforcing role-based access (admin > operator) through `AuthService`.

## External Integrations
- **Firebase Emulators** – Non-production builds auto-connect via `src/services/Firebase.ts`. Standard emulator ports: Auth 9099, Realtime DB 9000, Firestore 8080, Storage 9199, Functions 5001.
- **REST API** – Commands such as user creation (`POST /auth/create-user/`) go through Axios clients with interceptors and toast-based error feedback.
- **Socket.IO / WhatsApp** – `WhatsAppClient.ts` is a singleton per configured number. It emits QR/auth events and syncs chats with Firestore collections defined in `ChatRepository`.

## Development Workflow
- Install deps (`npm install`), copy `.env.example` → `.env.local`, and update Firebase/API URLs.
- Local dev: `npm run serve` (port 5000). Optional: `npm run start:emulators` to launch Firebase suites with exported seed data in `dataEmulators/`.
- Quality gates: `npm run lint`, `npm run test:unit`, `npm run build` for production bundles in `dist/`.
- Firebase deploys rely on `firebase.json`, `firebase.config.js`, and `storage.rules`/`database.rules.json`.

## Agent Guidance & Risks
- Follow the repository pattern; never bypass repositories for data writes. Update both RTDB and Firestore when required (e.g., services list + detail).
- Preserve Composition API `<script setup>` style and TypeScript typings. Define props/emits interfaces under `src/types/` when adding complex data.
- WhatsApp-related code is sensitive; ensure Socket.IO namespaces, QR flows, and Firestore chat syncing remain intact.
- CacheStore and other Pinia stores assume certain lifecycle hooks (subscribe/unsubscribe). When refactoring, keep listener cleanup logic.
- Default styling uses Bootstrap 5; avoid bespoke CSS unless necessary.

## Next Steps for Agents
1. Confirm `.env.local` mirrors `.env.example` before running commands or tests.
2. When adding features, update relevant stores, repositories, and types simultaneously to avoid runtime schema mismatches.
3. Expand Jest coverage under `tests/unit/` for new logic, especially repositories/services that touch Firebase or external APIs.
