import {defineStore} from 'pinia'

type Preference = 'system' | 'light' | 'dark'
type Effective = 'light' | 'dark'

const STORAGE_KEY = 'theme-preference'

function prefersDark(): boolean {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyBodyClass(isDark: boolean): void {
  document.body.classList.toggle('dark-version', isDark)
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    preference: 'system' as Preference,
    effective: 'light' as Effective,
  }),
  getters: {
    isDark(state): boolean {
      return state.effective === 'dark'
    },
  },
  actions: {
    init(): void {
      const saved = (localStorage.getItem(STORAGE_KEY) as Preference | null) || 'system'
      this.preference = saved
      this.updateEffective()

      if (window.matchMedia) {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = () => {
          if (this.preference === 'system') this.updateEffective()
        }
        // Update automatically when in system mode
        if (typeof mq.addEventListener === 'function') {
          mq.addEventListener('change', handler)
        } else {
          // Safari fallback for older MediaQueryList implementations
          const mqLegacy = mq as unknown as { addListener?: (cb: (e?: unknown) => void) => void }
          mqLegacy.addListener?.(handler)
        }
      }
    },
    setPreference(pref: Preference): void {
      this.preference = pref
      localStorage.setItem(STORAGE_KEY, pref)
      this.updateEffective()
    },
    toggle(): void {
      const next: Preference = this.isDark ? 'light' : 'dark'
      this.setPreference(next)
    },
    updateEffective(): void {
      const isDark = this.preference === 'dark' || (this.preference === 'system' && prefersDark())
      this.effective = isDark ? 'dark' : 'light'
      applyBodyClass(isDark)
      // Hint user-agent styling for form controls/scrollbars
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
    },
  },
})
