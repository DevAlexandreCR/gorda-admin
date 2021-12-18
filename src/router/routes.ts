const routes: Array<any> = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
    children: [
      {
        path: '/main',
        name: 'main',
        component: () => import('../views/Main.vue')
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
    path: '/dash',
    name: 'hist',
    component: () => import('../components/Hist.vue')
  }
]

export default routes