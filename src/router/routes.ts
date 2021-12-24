import Dashboard from '@/views/Dashboard.vue'
import Main from '@/views/Main.vue'
import Users from '@/views/users/Users.vue'
import Profile from '@/views/Profile.vue'
import UsersIndex from '@/views/users/Index.vue'

const routes: Array<any> = [
  {
    path: '/dashboard',
    name: 'dashboard',
    redirect: {name: 'main'},
    component: Dashboard,
    children: [
      {
        path: '/dashboard/main',
        name: 'main',
        component: Main
      },
      {
        path: '/dashboard/users',
        name: 'users',
        redirect: {name: 'users.index'},
        component: Users,
        children: [
          {
            path: '/dashboard/users/index/',
            name: 'users.index',
            component: UsersIndex
          }
        ]
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