import { createI18n } from 'vue-i18n'
import messages from '@/assets/locales/locale'

export default createI18n({
  legacy: false,
  locale: process.env.VUE_APP_I18N_LOCALE || 'es',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  globalInjection: true,
  messages: messages
})
