---
name: vuei18n-pluralization-pattern
description: How pluralization with interpolation works in this admin (vue-i18n v9, legacy:false)
metadata:
  type: project
---

vue-i18n v9 with `legacy: false` and `globalInjection: true`. `$tc` is NOT available in templates. Use `$t(key, namedParams, count)` for pluralization with interpolation.

Locale format uses pipe: `'key': '{n} item | {n} items'`

Template usage: `$t('ns.key', { n: someRef }, someRef)`

For simple plural without interpolation (just picking singular/plural word), `$t('ns.key', count)` suffices (as seen in `$t('common.models.users', 2)`).

**How to apply:** Always use `$t` not `$tc` in templates. When a footer or count line needs both pluralization AND a number shown, pass `{ n: count }` as named params and `count` as the third arg.
