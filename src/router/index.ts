import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
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

/* eslint-disable @typescript-eslint/no-explicit-any*/
const router = createRouter(<any>{
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
