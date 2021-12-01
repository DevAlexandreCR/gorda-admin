import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/Users',
    name: 'Usuario',
    component: () => import('../views/Users.vue')
  }
]

/* eslint-disable @typescript-eslint/no-explicit-any*/
const router = createRouter(<any>{
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
