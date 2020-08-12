import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'

Vue.use(VueRouter)

let router = new VueRouter({
  routes: [
    {
      component: () => import('@/views/Login'),
      meta: {
        requiresAdmin: false,
        requiresAuth: false
      },
      name: 'Login',
      path: '/login'
    },
    {
      component: () => import('@/views/Home'),
      meta: {
        requiresAdmin: false,
        requiresAuth: true
      },
      name: 'Home',
      path: '/'
    },
    {
      component: () => import('@/views/Timesheets'),
      meta: {
        requiresAdmin: true,
        requiresAuth: true
      },
      name: 'Timesheets',
      path: '/timesheets'
    },
    {
      component: () => import('@/views/Users'),
      meta: {
        requiresAdmin: true,
        requiresAuth: true
      },
      name: 'Users',
      path: '/users'
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

const authMiddleware = (router) => {
  router.beforeEach((to, from, next) => {
    if (to.matched.some(m => m.meta.requiresAuth)) {
      const loggedIn = store.getters['loggedIn']

      if (loggedIn) {
        if (to.matched.some(n => n.meta.requiresAdmin)) {
          const isAdmin = store.getters['isAdmin']

          if (isAdmin) {
            next()
          } else {
            next('/')
          }
        } else {
          next()
        }
      } else {
        next('/login')
      }
    } else {
      next()
    }
  })
}

authMiddleware(router)

export default router
