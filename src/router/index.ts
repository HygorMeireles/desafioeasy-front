import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import Page404Layout from '../layouts/Page404Layout.vue'
import RouteViewComponent from '../layouts/RouterBypass.vue'
import UIRoute from '../pages/admin/ui/route'
import { isLoggedIn } from '../services/authService'

const isAuthenticated = false
const routes: Array<RouteRecordRaw> = [
  {
    path: '/erro',
    component: () => import('@/components/ErrorPage.vue'),
  },
  {
    name: 'admin',
    path: '',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/erro',
        component: () => import('@/components/ErrorPage.vue'),
      },
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },
      {
        name: 'users',
        path: 'users',
        component: () => import('../pages/admin/users/Users.vue'),
      },
      {
        name: 'products',
        path: 'products',
        component: () => import('../pages/admin/products/Products.vue'),
      },
      {
        name: 'loads',
        path: 'loads',
        component: () => import('../pages/admin/loads/Loads.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/login/Login.vue'),
        beforeEnter: (to, from, next) => {
          if (isLoggedIn()) {
            next({ name: 'dashboard' })
          } else {
            next()
          }
        },
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/signup/Signup.vue'),
        beforeEnter: (to, from, next) => {
          if (isLoggedIn()) {
            next({ name: 'dashboard' })
          } else {
            next()
          }
        },
      },
      {
        path: '',
        redirect: (to) => {
          if (isAuthenticated && to.query.logout !== 'true') {
            return { name: 'login' }
          } else {
            return { name: 'login' }
          }
        },
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'login' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      document.querySelector('.app-layout__page')?.scrollTo(0, 0)
    }
  },
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((route) => route.meta.requiresAuth) && !isLoggedIn()) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
