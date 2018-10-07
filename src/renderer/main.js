import Vue from 'vue'
import Axios from 'axios'
import Buefy from 'buefy'
import moment from 'moment'

import './assets/sass/all.sass'
import '@fortawesome/fontawesome-free/scss/fontawesome.scss'
import '@fortawesome/fontawesome-free/scss/solid.scss'

import App from './App'
import Router from './router'
import { store, openDatabase } from './store'
import './icons'
import './filters'
import './electron-listener'
import {ipcRenderer} from 'electron'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = Axios

Vue.config.productionTip = false

Vue.use(Buefy, {
  defaultIconPack: 'fas'
})

/* eslint-disable no-new */
const vueInstance = new Vue({
  router: Router,
  store: store,
  components: { App },
  template: '<App/>',
  data: {
    unsaved: false
  },
  created(){
    if (this.$store.state.settings.lastfile) {
      openDatabase(this.$store.state.settings.lastfile)
    }
  },
  mounted () {
    // set theme
    document.documentElement.className = this.$store.state.settings.theme

    // Sets locale
    moment.locale(this.$store.state.settings.language)
  },
  watch: {
    '$store.state.settings.theme'(){
      document.documentElement.className = this.$store.state.settings.theme
    }
  }
}).$mount('#app')

ipcRenderer.on('goto', (event, arg) => {
  vueInstance.$router.push(arg.path)
})
