import Dashboard from '@/views/Dashboard.vue'
import Main from '@/views/Main.vue'
import Users from '@/views/Users.vue'
import Profile from '@/views/Profile.vue'

const routes: Array<any> = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    children: [
      {
        path: '/main',
        name: 'main',
        component: Main
      },
      {
        path: 'users',
        name: 'users',
        component: Users
      },
      {
        path: 'profile',
        name: 'profile',
        component: Profile
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  }
]

export default routes