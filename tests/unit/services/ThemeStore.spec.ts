import {useThemeStore, ThemeMode} from '@/services/stores/ThemeStore'
import {setActivePinia, createPinia} from 'pinia'

describe('ThemeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    document.body.classList.remove('dark-version')
    localStorage.clear()
  })

  it('toggles dark mode class on body', () => {
    const store = useThemeStore()
    store.setTheme(ThemeMode.DARK)
    expect(document.body.classList.contains('dark-version')).toBe(true)
    store.toggle()
    expect(document.body.classList.contains('dark-version')).toBe(false)
  })
})
