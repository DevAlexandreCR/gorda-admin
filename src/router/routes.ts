import Dashboard from '@/views/Dashboard.vue'
import Main from '@/views/Main.vue'
import Users from '@/views/Users.vue'
import Login from '@/views/Login.vue'

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
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

export default routes