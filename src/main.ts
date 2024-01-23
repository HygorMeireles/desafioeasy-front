import { createApp } from 'vue'
import i18n from './i18n'
import { createVuestic } from 'vuestic-ui'
import { createGtm } from '@gtm-support/vue-gtm'
import { createPinia } from 'pinia'
import store from './stores/vuex'
import { isLoggedIn } from '@/services/authService'
import stores from './stores'
import router from './router'
import vuesticGlobalConfig from './services/vuestic-ui/global-config'
import App from './App.vue'
import axios from 'axios'

const localAuthToken = localStorage.authToken
const cookieExists = localAuthToken !== 'undefined' && localAuthToken !== null

const app = createApp(App)

app.use(createPinia())
app.use(store)
app.use(stores)
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
    next({ name: 'login' })
  } else {
    next()
  }
})

app.mount('#app')
