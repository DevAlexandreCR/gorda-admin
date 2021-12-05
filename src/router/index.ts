import {createRouter, createWebHistory, RouterOptions} from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<any> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
]

const router = createRouter(<RouterOptions>{
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
