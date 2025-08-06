<template>
  <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl mt-3" id="navbarBlur">
    <div class="container-fluid py-1 px-3">
      <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
        <a href="javascript:" class="nav-link d-none d-xxl-block text-body p-0" id="iconNavbarSidenavLg">
          <div class="sidenav-toggler-inner">
            <em class="sidenav-toggler-line"></em>
            <em class="sidenav-toggler-line"></em>
            <em class="sidenav-toggler-line"></em>
          </div>
        </a>
        <div class="ms-md-auto pe-md-3 d-flex align-items-center">
        </div>
        <ul class="navbar-nav  justify-content-end">
          <li class="nav-item d-flex align-items-center">
            <a href="javascript:" class="nav-link text-body p-0" @click="toggleTheme" data-test="theme-toggle">
              <i :class="mode === ThemeMode.DARK ? 'fas fa-sun' : 'fas fa-moon'"></i>
            </a>
          </li>
          <li class="nav-item ps-3 d-flex align-items-center">
            <a href="javascript:" class="nav-link d-xxl-none text-body p-0" id="iconNavbarSidenav">
              <div class="sidenav-toggler-inner">
                <em class="sidenav-toggler-line"></em>
                <em class="sidenav-toggler-line"></em>
                <em class="sidenav-toggler-line"></em>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
import {useThemeStore, ThemeMode} from '@/services/stores/ThemeStore'
import {storeToRefs} from 'pinia'

const themeStore = useThemeStore()
const {mode} = storeToRefs(themeStore)

function toggleTheme(): void {
  themeStore.toggle()
}
</script>