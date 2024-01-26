import { createApp } from 'vue'
import i18n from './i18n'
import { createVuestic } from 'vuestic-ui'
import { createGtm } from '@gtm-support/vue-gtm'
import store from '@/store/vuex'
import { isLoggedIn } from '@/services/authService'
import router from './router'
import vuesticGlobalConfig from './services/vuestic-ui/global-config'
import App from './App.vue'
import axios from 'axios'

const localAuthToken = localStorage.authToken

const app = createApp(App)

app.use(store)
app.use(router)
app.use(i18n)
app.use(createVuestic({ config: vuesticGlobalConfig }))

if (import.meta.env.VITE_APP_GTM_ENABLED) {
  app.use(
    createGtm({
      id: import.meta.env.VITE_APP_GTM_KEY,
      debug: false,
      vueRouter: router,
    }),
  )
}

router.beforeEach((to, from, next) => {
  if (to.matched.some((route) => route.meta.requiresAuth) && !isLoggedIn()) {
    console.log('Redirecting to login')
    next({ name: 'login' })
  } else {
    next()
  }
})

app.mount('#app')
