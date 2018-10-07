import Vue from 'vue'
import Router from 'vue-router'
import ROUTES from './routes'
import {store} from '@/store'

Vue.use(Router)

const router = new Router({
  routes: ROUTES
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requiresAccount)) {
    if (store.state.accounts.length) {
      next()
    } else {
      next({
        path: '/home'
      })
    }
  } else {
    next()
  }
})

export default router
