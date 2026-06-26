---
name: gorda-admin-design
description: Use when building or editing any admin (Vue 3) frontend UI — views, components, styling, or markup under admin/src/. Applies the Gorda Admin Soft UI design language so new screens match the existing product look.
---

# Gorda Admin — Design System

The `admin` service is a **Vue 3 + Soft UI Dashboard (Creative Tim) + Bootstrap 5** SPA.
Apply this skill whenever you touch UI: `admin/src/views/**`, `admin/src/components/**`,
templates, scoped `<style>`, or any styling decision.

**Stance: descriptive, not prescriptive.** Match the conventions of the view you are
editing and the look of the existing product. Do **not** introduce a parallel design system,
new UI framework, or sweeping token refactor. Blend in.

> **Golden rule: the design kit is a *reference render*, not source you import.** It is
> React + external-design-tool output. You read it to learn *what the finished screen should
> look like*, then rebuild that look in production Vue using Soft UI / Bootstrap 5 classes and
> the production dark-mode mechanic. Never import its files, never copy its `data-theme` tokens.

## The reference kit — `admin/src/ui_design/`

A high-fidelity render of the intended look, emitted by an external design tool. **Start here
before designing any screen** — it shows the target visual, the component catalog, and the
exact token values. Layout:

| Path | What it is | How to use it |
|---|---|---|
| `readme.md` | The **design brief** — voice, casing, color, type, cards, buttons, inputs, icon chips, badges, radii, shadows, motion, iconography. | Read first. This is the prose spec of "what right looks like". |
| `tokens/` | `colors.css`, `typography.css`, `spacing.css`, `fonts.css`, `base.css` — the literal token values (hex, rem, shadows). | Look up exact values. **Do not import** — production tokens live in SCSS (below). |
| `cards/` | Foundation specimen HTML (color ramps, type scale, spacing, radii, shadows, brand). | Visual lookup for a specific token group. |
| `components/` | The component catalog, grouped `forms/`, `feedback/`, `data/`. Each component ships three files (see next section). | The vocabulary of UI primitives and their props/variants. |
| `ui_kits/admin/` | **Full screen recreations** — one `*.jsx` per screen + `index.html` to preview the whole app. | Open the view that matches your task to see a finished screen end-to-end. |
| `_ds_manifest.json` | Machine index of every token, component, card and screen. | Programmatic lookup of token names/values. |
| `styles.css`, `_ds_bundle.js` | Tool-emitted runtime glue. | **Ignore — never import into the app.** |

### Component catalog (`components/`)

Each primitive has: **`.jsx`** (the reference implementation), **`.d.ts`** (the prop contract —
read this to learn variants/defaults), **`.prompt.md`** (a one-liner + copy-paste usage examples).

- **forms/** — `Button`, `Input`, `Select`, `Switch`
- **feedback/** — `Badge`, `StatusBadge`, `Alert`
- **data/** — `Card`, `StatCard`, `Avatar`

Example — `Button.d.ts` documents `color` (primary/secondary/info/success/warning/danger/dark/light),
`variant` (gradient/solid/outline), `size`, `rounded`, `fullWidth`, `icon`. The login button is
`color="info" fullWidth`; table-action buttons are `rounded`.

### Screen recreations (`ui_kits/admin/`)

One JSX file per screen — open the one matching your task: `LoginView`, `DashboardView`,
`ServicesView`, `DriversView`, `EditDriverView`, `VehiclesView`, `VehicleDetailView`,
`SettingsView`, `WhatsAppView`, plus `Sidebar`, `TopNav`, `LoadingModal`, `EditMessageModal`.
`data.js` holds mock data; each view composes the catalog primitives. Each kit screen names the
production file it mirrors (e.g. `DriversView` ↔ `views/drivers/Index.vue`).

> The kit's own `ui_kits/admin/README.md` may lag the JSX (e.g. it calls Vehicles/WhatsApp
> "placeholders" though those views now exist). When the README and the `.jsx` disagree, **trust
> the `.jsx`** — it is the current render.

## How to apply the kit (implementer workflow)

1. **Find the matching reference.** Building/editing a screen → open the matching `ui_kits/admin/*.jsx`
   and preview `index.html`. Building a primitive (button, badge, input) → read that component's
   `.prompt.md` + `.d.ts` in `components/`.
2. **Read the brief.** Skim `readme.md` for the rules that apply (casing, color roles, card/shadow
   language, motion). Look up exact values in `tokens/` or `_ds_manifest.json` if needed.
3. **Translate React → production Vue.** Reproduce the *look*, not the code. Map kit primitives to
   the real implementation: prefer existing Soft UI / Bootstrap 5 classes and existing
   `admin/src/components/**` Vue components; only write custom CSS where no class exists.
4. **Map theming to production.** The kit's `[data-theme="dark"]` becomes `body.dark-version` in
   production (see below). Translate kit tokens to the centralized SCSS semantic tokens.
5. **Verify against the checklist** at the bottom.

## The palette (Soft UI — `admin/src/assets/scss/soft-ui-dashboard/_variables.scss`)

| Role | Color |
|---|---|
| Primary | `#cb0c9f` |
| Secondary | `#8392ab` |
| Success | `#82d616` · Info `#17c1e8` · Warning `#fbcf33` · Danger `#ea0606` |
| Headings | `#344767` · body `#67748e` · muted `#8392ab` |
| Primary gradient | `linear-gradient(310deg, #7928ca, #ff0080)` |
| Success / Info / Dark gradients | `#17ad37→#98ec2d` · `#2152ff→#21d4fd` · `#141727→#3a416f` |
| WhatsApp accents | greens `#25d366 #128c7e #075e54`, chat bg `#e5ddd5`, bubble `#dcf8c6` |

Type: **Open Sans**. Icons: **Font Awesome 6** (`fas fa-*`) and the bundled **nucleo** set.
Shape: rounded-xl cards, soft drop shadows, gradient-filled buttons and icon chips.

For new work, prefer the centralized semantic tokens defined in `admin/src/assets/scss/custom/__theme.scss`
(e.g. `var(--surface-card)`, `var(--text-heading)`, `var(--border-subtle)`) instead of hardcoding the
Soft UI hex values above — the theme file is the single source of truth for both light and dark values.

## Production conventions to follow

1. **Use Soft UI / Bootstrap 5 utility classes first.** Reach for the classes already in the
   codebase — `card`, `shadow-*`, `bg-gradient-{primary,success,…}`, `text-{primary,secondary,dark}`,
   `badge bg-gradient-*`, `btn bg-gradient-primary`, grid `row`/`col-*`, spacing `p-*`/`m-*`.
   Don't hand-roll CSS for something a Soft UI class already does.

2. **When custom CSS is unavoidable, follow the per-feature scoped-var pattern.** Production
   views declare local CSS variables in a scoped `<style>` block — light values on the feature
   class, dark overrides under `body.dark-version`:

   ```css
   .billing-page {
     --billing-heading: #344767;
     --billing-border: rgba(0, 0, 0, 0.08);
     --billing-input-bg: rgba(255, 255, 255, 0.96);
   }
   body.dark-version .billing-page {
     --billing-heading: #ffffff;
     --billing-border: rgba(255, 255, 255, 0.08);
     --billing-input-bg: #1a1d31;
   }
   ```
   Name vars after the feature (`--<feature>-<role>`). Always pair light + dark.

3. **Dark mode = `body.dark-version`** (Soft UI's mechanism, used across production views like
   `views/billing/Billing.vue`, `views/drivers/Edit.vue`, `components/vehicles/*`). Every
   custom-styled surface, text color, and border must have a `body.dark-version` counterpart.
   Never assume light only. The kit's `[data-theme="dark"]` is the *same intent expressed
   differently* — translate it, never copy it.

4. **Match the surrounding view.** Mirror the existing component's class usage, spacing rhythm,
   and var naming. Consistency with the file you're in beats global consistency.

5. **Vue patterns** (see `admin/agents.md`): Composition API `<script setup>` + TypeScript;
   data access through repositories → Pinia stores (never bypass for writes); props/emits
   types in `src/types/`. Keep real-time listener cleanup intact.

6. **i18n:** user-facing strings come from `admin/src/assets/locales/{en,es}/*` — add keys, don't
   hardcode copy. Remember the bilingual reality: **English UI chrome over Spanish operational
   data** (addresses, client comments, place names).

## Don't

- Don't import or bundle anything from `ui_design/` (`styles.css`, `_ds_bundle.js`, the `.jsx`/`.css`
  token files) — it is reference render output, not app source.
- Don't add a new UI/CSS framework or icon set, or new dependencies for styling.
- Don't adopt the kit's `data-theme` attribute mechanic, and don't bulk-migrate existing feature vars
  (`--drivers-filter-*`, `--wp-*`, `--detail-*`, `--billing-*`) onto the palette — migrate
  incrementally as views are edited.
- Don't write custom CSS where a Soft UI/Bootstrap class exists.
- Don't ship light-only styling — always provide the `body.dark-version` variant.
- Don't add comments unless logic is non-obvious (English only, per repo rules).

## Quick check before finishing

- [ ] Compared the result against the matching `ui_design/ui_kits/admin/*.jsx` and `readme.md`.
- [ ] Uses Soft UI palette + Open Sans; matches the kit's look.
- [ ] Reused existing Soft UI/Bootstrap classes and existing Vue components; custom CSS only where needed.
- [ ] Any custom CSS follows the scoped per-feature var pattern, with `body.dark-version` overrides.
- [ ] Did not import or copy from `ui_design/`; did not use the kit's `data-theme` mechanic.
- [ ] Consistent with the conventions of the edited view.
- [ ] Strings via i18n locales; types in `src/types/`; data via repositories/stores.
