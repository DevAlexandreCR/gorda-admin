import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n'
import 'bootstrap'
import {createPinia} from 'pinia'

const pinia = createPinia()

createApp(App)
  .use(i18n)
  .use(pinia)
  .use(router)
  .provide('appName', process.env.VUE_APP_TITLE)
  .mount('#app')
  
  