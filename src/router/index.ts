import {createRouter, createWebHistory, RouterOptions} from 'vue-router'
import authGuard from '@/router/guards/AuthGuard'
import routes from '@/router/routes'

const router = createRouter(<RouterOptions>{
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  authGuard(to, from, next)
})

export default router
