import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n'
import 'bootstrap'
import '@fortawesome/fontawesome-free/css/all.css'
import { createPinia } from 'pinia'
import axios from 'axios'
import * as Sentry from "@sentry/vue"
import { BrowserTracing } from "@sentry/tracing"
import { useThemeStore } from '@/services/stores/ThemeStore'
import { ensureAdminVersionSupported } from '@/services/VersionGuard'

axios.defaults.baseURL = window.location.origin
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accept'] = 'application/json;charset=UTF-8'

updateFavicon()

bootstrap().catch(() => undefined)

async function bootstrap() {
  const isVersionSupported = await ensureAdminVersionSupported()
  if (!isVersionSupported) {
    return
  }

  const pinia = createPinia()
  const themeStore = useThemeStore(pinia)
  themeStore.init()

  const app = createApp(App).provide('appName', process.env.VUE_APP_TITLE)

  Sentry.init({
    app,
    dsn: process.env.VUE_APP_SENTRY_DSN,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracePropagationTargets: [process.env.VUE_APP_DOMINIO ?? 'localhost'],
      }),
    ],
    tracesSampleRate: 0.8,
  })

  app.use(i18n)
    .use(pinia)
    .use(router)
    .provide('appName', process.env.VUE_APP_TITLE)
    .mount('#app')
}


function updateFavicon() {
  const favicon = process.env.VUE_APP_FAVICON || "/favicon.ico"
  let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']")

  if (!link) {
    link = document.createElement("link")
    link.rel = "icon"
    document.head.appendChild(link)
  }

  link.href = favicon
}
