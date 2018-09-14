import Vue from 'vue'
import Router from 'vue-router'
import ROUTES from './routes'

Vue.use(Router)

const index = new Router({
  routes: ROUTES
})

index.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requiresAccount)) {
    // TODO check if accounts exist
    if (true) {
      next({
        path: '/home'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default index
