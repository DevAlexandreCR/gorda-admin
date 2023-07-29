import Dashboard from '@/views/Dashboard.vue'
import Main from '@/views/Main.vue'
import Users from '@/views/users/Users.vue'
import Drivers from '@/views/drivers/Drivers.vue'
import Profile from '@/views/users/Profile.vue'
import UsersIndex from '@/views/users/Index.vue'
import UserEdit from '@/views/users/Edit.vue'
import DriverCreate from '@/views/drivers/Create.vue'
import DriverIndex from '@/views/drivers/Index.vue'
import DriverEdit from '@/views/drivers/Edit.vue'
import Connection from '@/views/Connection.vue'
import Places from '@/views/places/Places.vue'
import UserCreate from '@/views/users/Create.vue'
import adminGuard from "@/router/guards/AdminGuard";
import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import Metrics from '@/views/metrics/Metrics.vue'


const routes: Array<any> = [
  {
    path: '/',
    name: 'dashboard',
    redirect: {name: 'main'},
    component: Dashboard,
    meta: {
      requireRole: true
    },
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
        beforeEnter: (
          to: RouteLocationNormalized,
          from: RouteLocationNormalized,
          next: NavigationGuardNext
        ) => adminGuard(to, from, next),
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
          },
          {
            path: '/dashboard/users/create',
            name: 'users.create',
            component: UserCreate
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
            component: DriverEdit
          },
          {
            path: '/dashboard/drivers/create',
            name: 'drivers.create',
            component: DriverCreate
          }
        ]
      },
      {
        path: 'dashboard/places',
        name: 'places',
        redirect: {name: 'places.index'},
        component: Places,
        children: [
          {
            path: '/dashboard/places/index/',
            name: 'places.index',
            component: Places
          },
        ]
      },
      {
        path: 'profile',
        name: 'profile',
        component: Profile
      },
      {
        path: 'dashboard/connection',
        name: 'connection',
        component: Connection
      },
			{
				path: 'dashboard/metrics',
				name: 'metrics',
				redirect: {name: 'metrics.index'},
				component: Metrics,
				children: [
					{
						path: '/dashboard/metrics/index/',
						name: 'metrics.index',
						component: Metrics
					},
				]
			},
    ]
  },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('../views/Forbidden.vue')
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