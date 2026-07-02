<template>
  <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl mt-3 gorda-topnav" id="navbarBlur">
    <div class="container-fluid py-1 px-3">
      <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4 d-flex align-items-center justify-content-between" id="navbar">
        <div class="d-flex align-items-center gorda-topnav-left">
          <a href="javascript:" class="nav-link d-xxl-none text-body p-0 me-2" id="iconNavbarSidenav">
            <div class="sidenav-toggler-inner">
              <em class="sidenav-toggler-line"></em>
              <em class="sidenav-toggler-line"></em>
              <em class="sidenav-toggler-line"></em>
            </div>
          </a>
          <a href="javascript:" class="nav-link d-none d-xxl-block text-body p-0 me-2" id="iconNavbarSidenavLg">
            <div class="sidenav-toggler-inner">
              <em class="sidenav-toggler-line"></em>
              <em class="sidenav-toggler-line"></em>
              <em class="sidenav-toggler-line"></em>
            </div>
          </a>
          <div class="gorda-topnav-heading">
            <div class="gorda-topnav-breadcrumb">
              <span class="gorda-topnav-breadcrumb-root">{{ $t('common.breadcrumb.root') }}</span>
              <span class="gorda-topnav-breadcrumb-sep">/</span>
              <span class="gorda-topnav-breadcrumb-tail">{{ pageTitle }}</span>
            </div>
            <h6 class="gorda-topnav-title">{{ pageTitle }}</h6>
          </div>
        </div>
        <ul class="navbar-nav justify-content-end align-items-center">
          <li class="nav-item d-flex align-items-center me-3">
            <button
              class="gorda-topnav-icon-chip"
              type="button"
              :aria-label="isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
              @click="toggleTheme"
            >
              <em :class="isDark ? 'fas fa-sun' : 'fas fa-moon'" aria-hidden="true"></em>
            </button>
          </li>
          <li class="nav-item d-flex align-items-center">
            <img :src="logoUrl" class="gorda-topnav-avatar" alt="branch logo">
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {storeToRefs} from 'pinia'
import {useThemeStore} from '@/services/stores/ThemeStore'
import {useStorage} from '@/services/stores/Storage'

const theme = useThemeStore()
const isDark = computed(() => theme.isDark)
const toggleTheme = () => theme.toggle()

const storage = useStorage()
const {logoUrl} = storeToRefs(storage)

const route = useRoute()
const {t, te} = useI18n()

const pageTitle = computed(() => {
  const name = route.name
  if (!name) {
    const metaTitle = route.meta?.title as string | undefined
    return metaTitle || ''
  }
  const fullName = String(name)
  const fullKey = 'routes.' + fullName
  if (te(fullKey)) return t(fullKey)
  const firstSegment = fullName.split('.')[0]
  const firstSegmentKey = 'routes.' + firstSegment
  if (te(firstSegmentKey)) return t(firstSegmentKey)
  const metaTitle = route.meta?.title as string | undefined
  if (metaTitle) return metaTitle
  return fullName
})
</script>
<style scoped>
.gorda-topnav {
  --topnav-chip-bg: var(--surface-card);
  --topnav-chip-border: var(--border-color);
  --topnav-chip-icon-dark: #fbcf33;
  --topnav-chip-icon-light: #344767;
}

.gorda-topnav-left {
  min-width: 0;
  gap: 1rem;
}

.gorda-topnav-heading {
  min-width: 0;
}

.gorda-topnav-breadcrumb {
  font-size: 0.75rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gorda-topnav-breadcrumb-root {
  opacity: 0.6;
}

.gorda-topnav-breadcrumb-sep {
  margin: 0 0.4rem;
  opacity: 0.5;
}

.gorda-topnav-breadcrumb-tail {
  color: var(--text-heading);
  font-weight: 600;
}

.gorda-topnav-title {
  margin: 0.15rem 0 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-heading);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gorda-topnav-icon-chip {
  width: 36px;
  height: 36px;
  flex: none;
  border-radius: 0.5rem;
  background: var(--topnav-chip-bg);
  border: 1px solid var(--topnav-chip-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 9px -5px rgba(0, 0, 0, 0.3);
  padding: 0;
}

.gorda-topnav-icon-chip .fa-sun {
  color: var(--topnav-chip-icon-dark);
}

.gorda-topnav-icon-chip .fa-moon {
  color: var(--topnav-chip-icon-light);
}

.gorda-topnav-avatar {
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 9px -5px rgba(0, 0, 0, 0.4);
}
</style>
