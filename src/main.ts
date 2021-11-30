import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App)
    .use(router)
    .provide('appName', process.env.VUE_APP_TITLE)
    .mount('#app')