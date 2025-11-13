import {defineStore} from 'pinia'

export type ThemeVariant = 'light' | 'dark'

const STORAGE_KEY = 'gorda-admin:theme'
const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)'

type ThemeState = {
  theme: ThemeVariant
  initialized: boolean
  hasUserPreference: boolean
  mediaQuery: MediaQueryList | null
}

const getStoredTheme = (): ThemeVariant | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const value = window.localStorage.getItem(STORAGE_KEY)
  if (value === 'light' || value === 'dark') {
    return value
  }

  if (value) {
    window.localStorage.removeItem(STORAGE_KEY)
  }

  return null
}

const setStoredTheme = (theme: ThemeVariant): void => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, theme)
}

const clearStoredTheme = (): void => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
}

const prefersDarkMode = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }

  return window.matchMedia(COLOR_SCHEME_QUERY).matches
}

const applyDocumentTheme = (theme: ThemeVariant): void => {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  root.style.colorScheme = theme

  if (document.body) {
    document.body.classList.remove('theme-light', 'theme-dark')
    document.body.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light')
  }
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    theme: 'light',
    initialized: false,
    hasUserPreference: false,
    mediaQuery: null,
  }),
  actions: {
    initialize(): void {
      if (this.initialized) {
        return
      }

      this.initialized = true

      const storedTheme = getStoredTheme()
      if (storedTheme) {
        this.hasUserPreference = true
        this.theme = storedTheme
        applyDocumentTheme(storedTheme)
        this.detachMediaQuery()
        return
      }

      this.hasUserPreference = false
      const systemTheme: ThemeVariant = prefersDarkMode() ? 'dark' : 'light'
      this.theme = systemTheme
      applyDocumentTheme(systemTheme)
      this.attachMediaQuery()
    },
    toggleTheme(): void {
      const nextTheme: ThemeVariant = this.theme === 'dark' ? 'light' : 'dark'
      this.setTheme(nextTheme)
    },
    setTheme(theme: ThemeVariant): void {
      this.hasUserPreference = true
      this.theme = theme
      setStoredTheme(theme)
      this.detachMediaQuery()
      applyDocumentTheme(theme)
    },
    useSystemPreference(): void {
      this.hasUserPreference = false
      clearStoredTheme()
      const theme: ThemeVariant = prefersDarkMode() ? 'dark' : 'light'
      this.theme = theme
      applyDocumentTheme(theme)
      this.attachMediaQuery()
    },
    handleSystemThemeChange(event: MediaQueryListEvent): void {
      if (this.hasUserPreference) {
        return
      }

      const theme: ThemeVariant = event.matches ? 'dark' : 'light'
      this.theme = theme
      applyDocumentTheme(theme)
    },
    attachMediaQuery(): void {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return
      }

      this.detachMediaQuery()
      const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY)
      this.mediaQuery = mediaQuery

      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', this.handleSystemThemeChange)
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(this.handleSystemThemeChange)
      }
    },
    detachMediaQuery(): void {
      if (!this.mediaQuery) {
        return
      }

      if (typeof this.mediaQuery.removeEventListener === 'function') {
        this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange)
      } else if (typeof this.mediaQuery.removeListener === 'function') {
        this.mediaQuery.removeListener(this.handleSystemThemeChange)
      }

      this.mediaQuery = null
    },
  },
})
