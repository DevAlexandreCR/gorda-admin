import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './services/firebase'

createApp(App)
    .use(router)
    .provide('appName', process.env.VUE_APP_TITLE)
    .mount('#app')