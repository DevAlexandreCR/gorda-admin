const routes: Array<any> = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
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
    path: '/dash',
    name: 'hist',
    component: () => import('../components/Hist.vue')
  }
]

export default routes