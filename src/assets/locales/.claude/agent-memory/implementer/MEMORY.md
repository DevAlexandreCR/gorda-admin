# Implementer Memory Index

- [Admin lint pre-existing failures](project_admin_lint_preexisting.md) — ui_design/_ds_bundle.js has React errors that fail lint-check; ESLint individual file check is reliable instead
- [Admin build OOM in Docker](project_admin_build_oom.md) — full npm run build may get OOM-killed in Docker; use vue-tsc --noEmit for type validation instead
- [vue-i18n pluralization pattern](project_vuei18n_pluralization.md) — project uses legacy:false, $t(key, {n}, count) for plural+interpolation; pipe format in locale files
