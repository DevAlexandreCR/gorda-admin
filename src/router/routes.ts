import Dashboard from '@/views/Dashboard.vue'
import Main from '@/views/Main.vue'
import Users from '@/views/users/Users.vue'
import Drivers from '@/views/drivers/Drivers.vue'
import Profile from '@/views/users/Profile.vue'
import UsersIndex from '@/views/users/Index.vue'
import UserEdit from '@/views/users/Edit.vue'
import DriverCreate from '@/views/drivers/Create.vue'
import DriverIndex from '@/views/drivers/Index.vue'

const routes: Array<any> = [
  {
    path: '/',
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
          },
          {
            path: '/dashboard/users/:id/edit',
            name: 'users.edit',
            component: UserEdit
          }
        ]
      },
      {
        path: '/dashboard/drivers',
        name: 'drivers',
        redirect: {name: 'drivers.index'},
        component: Drivers,
        children: [
          {
            path: '/dashboard/drivers/index/',
            name: 'drivers.index',
            component: DriverIndex
          },
          {
            path: '/dashboard/drivers/:id/edit',
            name: 'drivers.edit',
          },
          {
            path: '/dashboard/drivers/create',
            name: 'drivers.create',
            component: DriverCreate
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
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: () => import('../views/SignUp.vue')
  }
]

export default routes