# Gorda Admin Service release notes

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Add a "Servicio de prueba" toggle to the create-service form with a mandatory target-driver selector, forced passenger count of 1, and a persistent no-charge note; test services are written with `directed_to` and `origin: 'test'`.
- Show a distinct "Prueba" origin badge in the pending, in-progress, and history services tables and in the service detail modal, which now also shows the target driver.

### Fixed

- Fix the connected-drivers map marker reconciliation: markers now add, move, and remove in real time, without losing an add and a remove that land in the same update, and without duplicating markers when the plate search filter is cleared.
- Fix `ServiceRepository.create()` unconditionally overwriting `origin` with `'admin'`, which clobbered the `'test'` origin of a directed test service.
- Fix `restart()` dropping the `origin` and `directed_to` fields when recreating a service.

## [2.1.0(2026-07-08)](https://github.com/DevAlexandreCR/admin-driver/compare/2.1.0...2.0.12)

### Added

- Redesign the Metrics page with revenue visibility: seven KPI cards (monthly services with MoM delta, completion rate, cancellation rate, leading driver, commission income, monthly-fee income, total recharges), an income-by-charge-type chart, a monthly income breakdown, and a day/week/month toggle on the top-5 drivers.
- Redesign the WhatsApp message editor: an interactive-message builder (button/list/location-request) with a live WhatsApp phone preview shown for all message editing.
- Add a collapsible sidebar rail whose collapsed state persists across sessions.

### Changed

- Unify all admin data tables on a shared design-system layer (`custom/__tables.scss`): soft-tint status pills with a leading dot and magenta selection controls across drivers, users, vehicles, and messages.

## [2.0.12(2026-07-05)](https://github.com/DevAlexandreCR/admin-driver/compare/2.0.12...2.0.11)

### Changed

- Replace the fullscreen blocking loading overlay with scoped loading feedback. The global overlay now appears only during initial app bootstrap (authentication and the dashboard's core data load). Data fetches (service history, route integrity report, metrics, settings tabs) use widget-local indicators backed by store flags that survive tab switches, so switching away no longer discards an in-flight report. Tables refresh stale-while-revalidate: existing rows stay visible (dimmed) while reloading instead of blanking the page. Concurrent fetches resolve last-request-wins, so rapid successive filters always show the latest results. Form mutations show button-local spinners with double-submit protection, and per-row actions (WhatsApp client toggles, message enable switches) indicate busy state only on the affected row.

## [2.0.11(2026-07-05)](https://github.com/DevAlexandreCR/admin-driver/compare/2.0.11...2.0.10)

### Added

- Add payment filters to the drivers view: filter by payment mode (monthly/percentage) and by payment status (paid/pending) for a selected period. The payment status and period selectors are round-tripped through the URL state alongside the existing search, status, and inactivity filters.
- Add a route integrity audit report in the services view: a new tab with a date-range filter listing per-driver metrics (total trips, flagged trips, and flagged ratio) to surface trips completed without a usable route capture.

### Added

- Add the ability to void an erroneously registered driver monthly payment from the driver detail view, with a reason prompt. Voided payments remain visible in the payment history, shown struck-through with a badge stating the reason, actor, and date.

## [2.0.9(2026-07-02)](https://github.com/DevAlexandreCR/admin-driver/compare/2.0.9...2.0.8)

### Fixed

- Close the sidenav on mobile when tapping outside of it or tapping a nav link inside it.
- Improve the autocomplete dropdown: support an optional leading icon per item and refine the list item styling.

## [2.0.8(2026-07-01)](https://github.com/DevAlexandreCR/admin-driver/compare/2.0.8...2.0.7)

### Added

- Show the per-service deducted value in the service detail modal, next to the fee.

## [2.0.7(2026-06-30)](https://github.com/DevAlexandreCR/admin-driver/compare/2.0.7...2.0.6)

### Fixed

- Show the vehicle bound to each service in the service list, detail modal, and in-progress plate search: resolve it from the live RTDB snapshot or the history record, falling back to the driver's currently selected vehicle, instead of the deprecated legacy driver vehicle field.

## [2.0.6(2026-06-25)](https://github.com/DevAlexandreCR/admin-driver/compare/2.0.6...2.0.5)

### Added

- Add driver monthly payment management: configure monthly payment settings and record/adjust per-driver balances from the driver detail view, with a payment history section.
- Add a balance formatting utility.

### Changed

- Optimize driver enable logic and remove the bulk enable action from the drivers view.
- Exclude in-progress services without an assigned driver from the services filtering.
- Improve dark mode theming and styling.

## [2.0.5(2026-06-12)](https://github.com/DevAlexandreCR/admin-driver/compare/2.0.5...2.0.4)

### Fixed

- Fix dark theme readability and local dropdown styling for vehicle plate lookup in driver create and edit flows. [#191](https://github.com/DevAlexandreCR/gorda-admin/pull/191)

## [2.0.4(2026-06-08)](https://github.com/DevAlexandreCR/admin-driver/compare/2.0.4...2.0.3)

### Added

- Show the client completed services count badge in the services table and service detail modal.
- Support bulk FCM messaging from the drivers view.

### Changed

- Redesign the driver filters bar with new status, payment mode, and inactivity filters plus paginated results.

# Release Notes for 2.0.x

## [2.0.2(2026-04-14)](https://github.com/DevAlexandreCR/admin-driver/compare/2.0.2...2.0.1)

### Changed

Improbe performance of the app with SQL database

## [2.0.0(2026-04-14)](https://github.com/DevAlexandreCR/admin-driver/compare/2.0.0...1.5.17)

### Added

Change firestore by SQL database


# Release Notes for 1.5.x

### Changed

## [1.5.17(2025-11-30)](https://github.com/DevAlexandreCR/admin-driver/compare/1.5.17...1.5.16)

- Use IndexDB to chats. [#189](https://github.com/DevAlexandreCR/gorda-admin/pull/189)
- Addrestart and edit pending services. [#189](https://github.com/DevAlexandreCR/gorda-admin/pull/189)


## [1.5.16(2025-11-29)](https://github.com/DevAlexandreCR/admin-driver/compare/1.5.16...1.5.15)

### Changed

- change clients db to postgres. [#187](https://github.com/DevAlexandreCR/gorda-admin/pull/187)


## [1.5.15(2025-11-12)](https://github.com/DevAlexandreCR/admin-driver/compare/1.5.15...1.5.14)

### Added

- Dark mode support. [#185](https://github.com/DevAlexandreCR/gorda-admin/pull/185)

## [1.5.14(2025-11-12)](https://github.com/DevAlexandreCR/admin-driver/compare/1.5.14...1.5.13)

### Added

- Embedded signup and coexistence. [#181](https://github.com/DevAlexandreCR/gorda-admin/pull/181)

## [1.5.13(2025-10-18)](https://github.com/DevAlexandreCR/admin-driver/compare/1.5.13...1.5.12)

### Added

- Full modal and claim chat. [#180](https://github.com/DevAlexandreCR/gorda-admin/pull/180)

## [1.5.12(2025-10-05)](https://github.com/DevAlexandreCR/admin-driver/compare/1.5.12...1.5.11)

### Changed

- improve chat messages view. [#179](https://github.com/DevAlexandreCR/gorda-admin/pull/179)

## [1.5.11(2025-10-05)](https://github.com/DevAlexandreCR/admin-driver/compare/1.5.11...1.5.10)

### Changed

- use api for places not firebase directly. [#177](https://github.com/DevAlexandreCR/gorda-admin/pull/177)


## [1.5.10(2025-08-06)](https://github.com/DevAlexandreCR/admin-driver/compare/1.5.10...1.5.9)

### Fixed
- Service user info in historial.

## [1.5.9(2025-07-09)](https://github.com/DevAlexandreCR/admin-driver/compare/1.5.9...1.5.8)

### Added
- Add fee multiplier dynamic. [#173](https://github.com/DevAlexandreCR/gorda-admin/pull/173)

## [1.5.8(2025-06-01)](https://github.com/DevAlexandreCR/admin-driver/compare/1.5.8...1.5.7)

### Fixed
- Fix in update operation [#171](https://github.com/DevAlexandreCR/gorda-admin/pull/171)

## [1.5.7(2025-05-27)](https://github.com/DevAlexandreCR/admin-driver/compare/1.5.7...1.5.6)

### Added
- Add support notifications. [#169](https://github.com/DevAlexandreCR/gorda-admin/pull/169)

## [1.5.6(2025-05-20)](https://github.com/DevAlexandreCR/admin-driver/compare/1.5.6...1.5.5)

### Changed
- Update driver store from database when a user open the driver view. [#167](https://github.com/DevAlexandreCR/gorda-admin/pull/167)

### Added
- Add support to interactive messages. [#165](https://github.com/DevAlexandreCR/gorda-admin/pull/165)

- Add go back button to drivers. [#166](https://github.com/DevAlexandreCR/gorda-admin/pull/166)

## [1.5.5(2025-05-13)](https://github.com/DevAlexandreCR/admin-driver/compare/1.5.5...1.5.4)

### Added
- Add payment mode filter to drivers. [#163](https://github.com/DevAlexandreCR/gorda-admin/pull/163)

## [1.5.4(2025-04-27)](https://github.com/DevAlexandreCR/admin-driver/compare/1.5.4...1.5.3)

### Changed
- Remove operator restriction. [#161](https://github.com/DevAlexandreCR/gorda-admin/pull/161)

## [1.5.3(2025-03-26)](https://github.com/DevAlexandreCR/admin-driver/compare/1.5.3...1.5.2)

### Added
- Add last connection. [#151](https://github.com/DevAlexandreCR/gorda-admin/pull/151)

## [1.5.2(2025-02-16)](https://github.com/DevAlexandreCR/admin-driver/compare/1.5.2...1.5.1)

### Added
- Add cache to chats. [#149](https://github.com/DevAlexandreCR/gorda-admin/pull/149)

## [1.5.1(2024-12-02)](https://github.com/DevAlexandreCR/admin-driver/compare/1.5.1...1.5.0)

### Added
- Add dynamic min fee. [#148](https://github.com/DevAlexandreCR/gorda-admin/pull/148)

## [1.5.0(2024-11-30)](https://github.com/DevAlexandreCR/admin-driver/compare/1.5.0...1.4.3)

### Added
- Manage balance of drivers. [#146](https://github.com/DevAlexandreCR/gorda-admin/pull/146)

# Release Notes for 1.4.x

## [1.4.7(2024-10-21)](https://github.com/DevAlexandreCR/admin-driver/compare/1.4.7...1.4.6)

### Added
- Add top 5 metric. [#152](https://github.com/DevAlexandreCR/gorda-admin/pull/152)

## [1.4.6(2024-10-14)](https://github.com/DevAlexandreCR/admin-driver/compare/1.4.6...1.4.5)

### Added
- Restart button from Connection. [#148](https://github.com/DevAlexandreCR/gorda-admin/pull/148)

## [1.4.5(2024-09-15)](https://github.com/DevAlexandreCR/admin-driver/compare/1.4.5...1.4.4)

### Changed
- Use Baileys as default whatsapp service. [#146](https://github.com/DevAlexandreCR/gorda-admin/pull/146)

## [1.4.4(2024-09-09)](https://github.com/DevAlexandreCR/admin-driver/compare/1.4.4...1.4.3)

### Fixed
- Client name not showing. [#146](https://github.com/DevAlexandreCR/gorda-admin/pull/146)

## [1.4.3(2024-09-05)](https://github.com/DevAlexandreCR/admin-driver/compare/1.4.3...1.4.2)

### Fixed
- Client name update. [#144](https://github.com/DevAlexandreCR/gorda-admin/pull/144)

## [1.4.2(2024-08-10)](https://github.com/DevAlexandreCR/admin-driver/compare/1.4.2...1.4.1)

### Added
- Add new implementation and view for see who created such services. [#136](https://github.com/DevAlexandreCR/gorda-admin/pull/136)
- An Admin can Enable-Disable Drivers. [#135](https://github.com/DevAlexandreCR/gorda-admin/pull/135)

### Fixed
- Error when editing a user. [#142](https://github.com/DevAlexandreCR/gorda-admin/pull/142)

## [1.4.1(2024-07-24)](https://github.com/DevAlexandreCR/admin-driver/compare/1.4.1...1.4.0)

### Fixed
- FIx query to load chats. [#137](https://github.com/DevAlexandreCR/gorda-admin/pull/141)

## [1.4.0(2024-07-23)](https://github.com/DevAlexandreCR/admin-driver/compare/1.4.0...1.3.5)

### Added

- New module to chat and integrate Whatsapp Api. [#137](https://github.com/DevAlexandreCR/gorda-admin/pull/137)

# Release Notes for 1.3.x

## [1.3.5(2024-05-13)](https://github.com/DevAlexandreCR/admin-driver/compare/1.3.5...1.3.4)

### Added
- Edit WP messages module. [#129](https://github.com/DevAlexandreCR/admin-driver/pull/129)

## [1.3.4(2024-05-07)](https://github.com/DevAlexandreCR/admin-driver/compare/1.3.4...1.3.3)

### Changed
- Remove index release. [#132](https://github.com/DevAlexandreCR/admin-driver/pull/132)

## [1.3.3(2024-04-21)](https://github.com/DevAlexandreCR/admin-driver/compare/1.3.3...1.3.2)

### Added
- Add route map and service detail. [#130](https://github.com/DevAlexandreCR/admin-driver/pull/130)

## [1.3.2(2024-03-25)](https://github.com/DevAlexandreCR/admin-driver/compare/1.3.2...1.3.1)

### Added
- Remove driver index when released. [#125](https://github.com/DevAlexandreCR/admin-driver/pull/125)

## [1.3.1(2024-03-19)](https://github.com/DevAlexandreCR/admin-driver/compare/1.3.1...1.3.0)

### Added
- Now admin can enable and disable chatBot. [#114](https://github.com/DevAlexandreCR/admin-driver/pull/114)

### Fixed
- Fix when create a WpClient with the phone number with spaces [#122](https://github.com/DevAlexandreCR/gorda-admin/pull/122)
- Fix Filtered drivers and clients in the history [#120](https://github.com/DevAlexandreCR/gorda-admin/pull/120)

## [1.3.0(2024-02-03)](https://github.com/DevAlexandreCR/admin-driver/compare/1.3.0...1.2.10)

### Added
- Now admin can set 2 or more whatsapp clients. [#112](https://github.com/DevAlexandreCR/admin-driver/pull/112)
- Pagination added with cursors of the consultation with firestore [#117](https://github.com/DevAlexandreCR/gorda-admin/pull/117)
- added function to autocomplete if user does not exist [#118](https://github.com/DevAlexandreCR/gorda-admin/pull/118)

# Release Notes for 1.2.x

## [1.2.10(2023-12-11)](https://github.com/DevAlexandreCR/admin-driver/compare/1.2.10...1.2.9)

### Fixed
- Fix filtered drivers when update [#111](https://github.com/DevAlexandreCR/admin-driver/pull/111)

### Changed
- Add responsive tabs to dashboard. [#107](https://github.com/DevAlexandreCR/admin-driver/pull/107)

## [1.2.9(2023-09-19)](https://github.com/DevAlexandreCR/admin-driver/compare/1.2.9...1.2.8)

### Added
- Admin can remove driver's devices. [#100](https://github.com/DevAlexandreCR/admin-driver/pull/100)

## [1.2.8(2023-08-30)](https://github.com/DevAlexandreCR/admin-driver/compare/1.2.8...1.2.7)

### Added
- Admin can remove driver's devices. [#100](https://github.com/DevAlexandreCR/admin-driver/pull/100)

## [1.2.7(2023-08-18)](https://github.com/DevAlexandreCR/admin-driver/compare/1.2.7...1.2.6)

### Fixed
- Styles and update dependencies. [#98](https://github.com/DevAlexandreCR/admin-driver/pull/98)

## [1.2.6(2023-08-17)](https://github.com/DevAlexandreCR/admin-driver/compare/1.2.6...1.2.5)

### Fixed
- Performance of metrics. [#96](https://github.com/DevAlexandreCR/admin-driver/pull/96)

## [1.2.5(2023-08-17)](https://github.com/DevAlexandreCR/admin-driver/compare/1.2.5...1.2.4)

### Added
- Add metrics view. [#94](https://github.com/DevAlexandreCR/admin-driver/pull/94)
- Add reset password to users. [#93](https://github.com/DevAlexandreCR/admin-driver/pull/93)

## [1.2.4(2023-07-13)](https://github.com/DevAlexandreCR/admin-driver/compare/1.2.4...1.2.3)

### Added
- Add mark to occupied drivers. [#92](https://github.com/DevAlexandreCR/admin-driver/pull/92)

## [1.2.3(2023-06-12)](https://github.com/DevAlexandreCR/admin-driver/compare/1.2.3...1.2.2)

### Fixed
- Error editing password. [#89](https://github.com/DevAlexandreCR/admin-driver/pull/89)

## [1.2.2 (2023-06-08)](https://github.com/DevAlexandreCR/admin-driver/compare/1.2.2...1.2.1)

### Added
- Edit password. [#87](https://github.com/DevAlexandreCR/admin-driver/pull/87)
- Search driver on in progress tab. [#86](https://github.com/DevAlexandreCR/admin-driver/pull/86)

## [1.2.1 (2023-06-01)](https://github.com/DevAlexandreCR/admin-driver/compare/1.2.1...1.2.0)

### Changed
- Resolve indexes. [#84](https://github.com/DevAlexandreCR/admin-driver/pull/84)

## [1.2.0 (2023-05-31)](https://github.com/DevAlexandreCR/admin-driver/compare/1.2.0...1.1.8)

# Release Notes for 1.1.x

### Changed
- Remove cancel timeout. [#82](https://github.com/DevAlexandreCR/admin-driver/pull/82)

## [1.1.8 (2023-05-2)](https://github.com/DevAlexandreCR/admin-driver/compare/1.1.8...1.1.7)

### Changed
- Remove cancel timeout. [#80](https://github.com/DevAlexandreCR/admin-driver/pull/80)
