import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './plugins/i18nplugin'


createApp(App)
  .use(router)
  .use(i18n)
  .provide('appName', process.env.VUE_APP_TITLE)
  .mount('#app')
  
  