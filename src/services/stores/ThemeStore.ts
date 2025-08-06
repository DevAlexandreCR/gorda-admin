import {defineStore} from 'pinia'

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark'
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: ThemeMode.LIGHT as ThemeMode
  }),
  actions: {
    init(): void {
      const stored = localStorage.getItem('theme') as ThemeMode | null
      if (stored === ThemeMode.DARK || stored === ThemeMode.LIGHT) {
        this.mode = stored
      }
      this.applyTheme()
    },
    setTheme(mode: ThemeMode): void {
      this.mode = mode
      localStorage.setItem('theme', mode)
      this.applyTheme()
    },
    toggle(): void {
      this.setTheme(this.mode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK)
    },
    applyTheme(): void {
      if (typeof document === 'undefined') return
      if (this.mode === ThemeMode.DARK) {
        document.body.classList.add('dark-version')
      } else {
        document.body.classList.remove('dark-version')
      }
    }
  }
})
