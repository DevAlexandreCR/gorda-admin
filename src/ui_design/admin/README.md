# Gorda Admin — UI Kit

A high-fidelity recreation of the **Gorda Admin** dashboard (Vue 3 + Soft UI Dashboard, Bootstrap 5), rebuilt in React using the design system's own component primitives.

## What it covers
- **Login** (`LoginView.jsx`) — gradient brand header overlapping a white card, matching `views/Login.vue`.
- **Dashboard** (`DashboardView.jsx`) — KPI `StatCard` row + latest-services & drivers-online panels.
- **Services** (`ServicesView.jsx`) — the app's home screen: Pending / In progress / History tabs over a service table, with `StatusBadge`, applicant-count badge, WhatsApp-vs-Admin origin, and pickup-edit affordance. Mirrors `components/services/Tabs.vue` + `ServicesTable.vue`.
- **Drivers** (`DriversView.jsx`) — searchable roster with avatars, enable/disable `Switch`, status `Badge`, filter pills and paginator. Mirrors `views/drivers/Index.vue`.
- **Settings** (`SettingsView.jsx`) — WhatsApp confirmation & ChatBot message toggles. Mirrors `views/settings/messages/Index.vue`.
- **Sidebar / TopNav** — the floating rounded-xl sidebar with icon-chip nav and the breadcrumb top bar.

Vehicles, Places, Metrics and the WhatsApp connection screen are intentionally left as placeholders — they exist in the product but aren't recreated here.

## Run it
Open `index.html`. You land on the login screen; click **Sign in** to enter the shell, then use the sidebar to move between Services, Drivers and Settings.

## How it's wired
- `data.js` holds all mock data (`window.GordaData`).
- Each view reads primitives from `window.GordaDesignSystem_019e24` (Button, Input, Switch, Card, StatCard, Badge, StatusBadge, Avatar, Alert).
- Icons are **Font Awesome 6** from CDN — the same icon set the real app ships.

> Source of truth: the `admin/` Vue codebase. This kit copies the look, not the production logic.
