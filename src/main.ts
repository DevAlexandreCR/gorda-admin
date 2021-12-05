import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import firebase from './plugins/firebase'


createApp(App)
  .use(router)
  .use(firebase)
  .provide('appName', process.env.VUE_APP_TITLE)
  .mount('#app')