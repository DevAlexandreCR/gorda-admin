<template>
  <button
    type="button"
    :class="['btn', size, variant, 'theme-toggle']"
    :aria-label="themeButtonLabel"
    :title="themeButtonLabel"
    :aria-pressed="isDarkTheme"
    @click="onToggleTheme"
  >
    <em :class="['fa-solid', isDarkTheme ? 'fa-sun' : 'fa-moon']"></em>
    <span v-if="showLabel" :class="labelClass">{{ themeButtonLabel }}</span>
  </button>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {storeToRefs} from 'pinia'
import {useI18n} from 'vue-i18n'
import {useThemeStore} from '@/services/stores/ThemeStore'

const props = defineProps<{variant?: string; size?: string; showLabel?: boolean; labelClass?: string}>()

const themeStore = useThemeStore()
const {theme} = storeToRefs(themeStore)
const {t} = useI18n()

const isDarkTheme = computed(() => theme.value === 'dark')
const themeButtonLabel = computed(() => isDarkTheme.value ? t('common.actions.switch_to_light') : t('common.actions.switch_to_dark'))

const variant = computed(() => props.variant ?? 'btn-outline-primary')
const size = computed(() => props.size ?? 'btn-sm')
const showLabel = computed(() => props.showLabel ?? true)
const labelClass = computed(() => props.labelClass ?? 'fw-semibold')

const onToggleTheme = (): void => {
  themeStore.toggleTheme()
}
</script>
