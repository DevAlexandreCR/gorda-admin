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

## Visual reference

`admin/src/ui_design/admin/` is a high-fidelity render of the intended look (login,
dashboard, services, drivers, settings, WhatsApp). Open `index.html` to see how a finished
screen should feel. Treat it as **reference for "what right looks like"** — its `styles.css`
and `_ds_bundle.js` are emitted by an external design tool and are **not** importable into
the app. Don't copy its `data-theme` token names; production uses different mechanics (below).

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

3. **Dark mode = `body.dark-version`** (Soft UI's mechanism). Every custom-styled surface,
   text color, and border must have a `body.dark-version` counterpart. Never assume light only.

4. **Match the surrounding view.** Mirror the existing component's class usage, spacing rhythm,
   and var naming. Consistency with the file you're in beats global consistency.

5. **Vue patterns** (see `admin/agents.md`): Composition API `<script setup>` + TypeScript;
   data access through repositories → Pinia stores (never bypass for writes); props/emits
   types in `src/types/`. Keep real-time listener cleanup intact.

6. **i18n:** user-facing strings come from `admin/src/assets/locales/{en,es}/*` — add keys, don't
   hardcode copy.

## Don't

- Don't add a new UI/CSS framework or icon set, or new dependencies for styling.
- Don't invent a global token layer or migrate existing views to the kit's `data-theme` tokens —
  this skill is descriptive.
- Don't write custom CSS where a Soft UI/Bootstrap class exists.
- Don't ship light-only styling — always provide the `body.dark-version` variant.
- Don't add comments unless logic is non-obvious (English only, per repo rules).

## Quick check before finishing

- [ ] Uses Soft UI palette + Open Sans; matches the kit's look.
- [ ] Reused existing Soft UI/Bootstrap classes; custom CSS only where needed.
- [ ] Any custom CSS follows the scoped per-feature var pattern, with `body.dark-version` overrides.
- [ ] Consistent with the conventions of the edited view.
- [ ] Strings via i18n locales; types in `src/types/`; data via repositories/stores.
