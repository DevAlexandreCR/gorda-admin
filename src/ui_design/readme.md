# Gorda Design System

A design system for **Gorda** — a WhatsApp-first ride-hailing platform. Clients request rides by chatting on WhatsApp; a bot turns each request into a *service*; drivers receive and complete trips through an Android app; and operators run everything from the **Gorda Admin** web dashboard. Gorda is offered as a tenant platform (multiple branches / cities — e.g. "Red Blanca").

This system captures the look and feel of the **admin dashboard**, which is built on the [Soft UI Dashboard](https://www.creative-tim.com/product/soft-ui-dashboard) theme (Bootstrap 5) with a magenta brand identity.

> **The brief: improve, don't redesign.** This system documents and tightens what already exists — same magenta, same Open Sans, same Soft UI card/shadow language — so future work stays consistent with the live product rather than reinventing it.

## Sources
- **Codebase:** `admin/` — the Gorda Admin Vue 3 app (`vue-cli`, Pinia, Firebase). Surfaces: services queue, drivers, vehicles, places, WhatsApp connection, metrics, billing, settings.
- **GitHub:** [`DevAlexandreCR/gorda-admin`](https://github.com/DevAlexandreCR/gorda-admin) — explore this repo for deeper structure (components, repositories, locales) when building new admin designs.
- Theme lineage: Soft UI Dashboard SCSS lives at `admin/src/assets/scss/`. Token values here were lifted verbatim from `soft-ui-dashboard/_variables.scss`.

---

## Content fundamentals

**Voice.** Operational, terse, functional — this is an internal operations tool, not marketing copy. Labels are nouns or short verb phrases: "New service", "Send to all", "Send message", "Add filter", "Save changes". No exclamation, no personality copy.

**Casing.** Labels and headings use **Title case** sparingly — most UI labels are **Sentence case** ("New service created", "Ask for pickup location"). Buttons render **UPPERCASE** via CSS (the source text is sentence case). Table column headers are **UPPERCASE**, 10px, letter-spaced, muted slate. Status names are capitalized single words (Pending, Completed, Canceled).

**Person.** Neutral/imperative — the UI addresses the operator with commands ("Select a branch to update the pickup address") and states facts about entities ("Service has a driver assigned", "Client does not exist, therefore a new one has been created"). No "I"; rare "you".

**Bilingual reality.** The product runs in English (UI chrome) over **Spanish operational data** — addresses, client comments and place names are Spanish ("Cra. 7 #45-12, Chapinero", "Tiene dos maletas"). Design mocks should reflect this mix: English labels, Spanish content.

**Emoji.** None. The brand mark is a cat illustration, but emoji are never used in UI copy. Status is shown with colored dots/badges, not emoji.

**Domain vocabulary.** *Service* (a ride request), *Driver*, *Vehicle*, *Place* (saved location), *Branch/City* (tenant), *Applicant* (driver who applied to a pending service), *WhatsApp Bot* vs *Admin panel* (service origin), *Balance* (driver wallet), *Pending / In progress / Completed / Canceled* (lifecycle).

---

## Visual foundations

**Color.** The signature is **Gorda magenta `#cb0c9f`** — primary actions, active nav, links, focus rings. Headings are deep navy `#344767`; body is slate `#67748e`; muted text `#8392ab`. Semantic colors follow Soft UI: info cyan `#17c1e8`, success lime `#82d616`, warning amber `#fbcf33`, danger red `#ea0606`. Domain accents: WhatsApp green `#25d366`, driver-filter amber.

**Gradients.** Soft UI's signature **310° gradients** appear on primary buttons, icon chips, stat-card icons and the login header — most often primary `#7928CA → #FF0080` (a purple-to-pink that reads as the magenta family). Used as *fills on small elements*, not full-page backgrounds.

**Type.** **Open Sans** everywhere (Google Fonts), weights 300/400/600/700. Headings 700, navy, tight line-height. "Bold" in this system means 600; "bolder" means 700. Generous body line-height (1.6). Eyebrow/table-head text is 10–12px uppercase with letter-spacing.

**Backgrounds.** App shell is flat light gray `#f8f9fa` — **no** patterns, textures or photography in the chrome. Imagery appears only as content (driver photos, vehicle photos, branch avatar). The one gradient surface is the login header card.

**Cards.** The defining element: **white, `border-radius: 1rem` (16px), `box-shadow: 0 20px 27px 0 rgba(0,0,0,0.05)`** — a soft, diffuse, low-opacity drop shadow with no border. Everything lives on cards: the sidebar is a floating rounded card, tables sit in cards, panels are cards.

**Buttons.** Rounded `0.5rem` (or pill when `rounded`), **uppercase** label, 700 weight, slight negative letter-spacing, gradient/solid/outline fills, button shadow. Hover **lifts** (`scale(1.02)`); the interaction is a gentle grow, not a color jump.

**Inputs.** White, 1px `#d2d6da` border, `0.5rem` radius. Focus → magenta-tinted border + soft pink glow (`box-shadow` ring). Labels are 12px/700 navy above the field.

**Icon chips.** A recurring motif: a small **white rounded square (`0.5rem`) with a soft shadow** holding a single icon — magenta when idle, gradient-filled with a white icon when active (the sidebar nav uses this).

**Badges.** Small uppercase pills, either **soft-tint** (pale bg + saturated text) or **solid/gradient**. Status badges carry a leading colored dot.

**Radii.** 2/4/8/12/16/24px scale. Inputs & buttons 8px, cards & sidebar 16px, badges & filter pills fully rounded.

**Shadows.** A layered elevation system — `xs` for subtle chips, the signature `card` shadow (20px blur, 5% black) for surfaces, `lg`/`xl` for modals, a dedicated `button` shadow. Shadows are always soft, diffuse and low-opacity; never hard or dark.

**Motion.** Subtle and quick — `ease-in-out` 0.2s on most transitions, a springy `cubic-bezier` bounce reserved for playful affordances. Buttons lift on hover; switches slide. No parallax, no long animations, `prefers-reduced-motion` friendly.

**States.** Hover = lift / soft tint; active nav = white card + gradient icon chip; press = the lift settles. Disabled = 65% opacity, gray-200 fill. Loading = a `fa-spin` spinner with muted "waiting" text, table rows dim to 50% opacity rather than disappearing.

**Transparency / blur.** Minimal. The navbar can blur on scroll in the live app, but the system favors solid white surfaces over glass.

---

## Iconography

- **Font Awesome 6** (solid + brands) is the icon system the admin app ships, loaded from CDN. Use `fas`/`fa-solid` for UI glyphs and `fa-brands fa-whatsapp` for the WhatsApp channel. In mocks, link `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css`.
- **The icon-chip pattern:** icons are rarely bare — they sit in a white rounded square with a soft shadow (idle: magenta icon; active: gradient fill, white icon). See the sidebar and stat cards.
- A few **brand SVGs** ship in the repo (`assets/svg/whatsapp.svg`, `connection.svg`, `settings.svg`) plus a custom "shop" SVG inline in the dashboard nav. These are copied into `assets/svg/`.
- **Nucleo icon font** also ships in the original theme (`admin/src/assets/fonts/nucleo-*`) but Font Awesome is what's used in practice.
- **No emoji**, no unicode-glyph icons (except the occasional `●` status dot and `—` em-dash for empty values).
- **Logo:** the Gorda mark is a magenta cat illustration (`assets/logo.png`); a larger square app icon is `assets/gorda.png`.

---

## Index / manifest

**Root**
- `styles.css` — global entry point (`@import`s only). Consumers link this.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`, `base.css`.
- `assets/` — `logo.png`, `gorda.png`, `default_user.png`, `redblanca.jpg`, backgrounds, `svg/`.
- `cards/` — foundation specimen cards (Colors, Type, Spacing, Brand) for the Design System tab.
- `SKILL.md` — Agent-Skill manifest for downloadable use.

**Components** (`components/`, namespace `window.GordaDesignSystem_019e24`)
- `forms/` — **Button**, **Input**, **Select**, **Switch**
- `feedback/` — **Badge**, **StatusBadge**, **Alert**
- `data/` — **Card**, **StatCard**, **Avatar**

**UI Kits** (`ui_kits/`)
- `admin/` — full Gorda Admin recreation: Login, Dashboard, Services, Drivers, Settings + Sidebar/TopNav.

> Want to build new Gorda admin designs? Read this README, then browse [`DevAlexandreCR/gorda-admin`](https://github.com/DevAlexandreCR/gorda-admin) for the real components and copy.
