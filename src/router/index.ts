import {createRouter, createWebHistory, RouteRecordRaw, RouterOptions} from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      {
        path: '/',
        name: 'main',
        component: () => import('../components/HelloWorld.vue')
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('../views/Users.vue')
      }
    ]
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
  ,
  {
    path: '/Dash',
    name: 'Hist',
    component: () => import('../components/Hist.vue')
  }
]

const router = createRouter(<RouterOptions>{
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
