import Vue from 'vue'
import Axios from 'axios'
import Buefy from 'buefy'

import './assets/sass/all.sass'
// nodeModules
import jsonfile from 'jsonfile'
import path from 'path'
import moment from 'moment'
import {ipcRenderer} from 'electron'

import App from './App'
import Router from './router'
import { store, loadFromFile } from './store'

import './icons'
import './filters'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = Axios

Vue.config.productionTip = false

let globSettings = jsonfile.readFileSync(path.join(__static, 'settings.json'))


if (globSettings.lastfile) {
  loadFromFile(globSettings.lastfile)
}

Vue.use(Buefy, {
  defaultIconPack: 'fa'
})

/* eslint-disable no-new */
new Vue({
  router: Router,
  store: store,
  components: { App },
  template: '<App/>',
  data: {
    settings: globSettings,
    unsaved: false,
    db: null
  },
  methods: {
    // Functions
    updateSQL: function (sqlType) {
      switch (sqlType) {
        case 'dashboard':
          ipcRenderer.send('tab-update', 0)
          break
        case 'accounts-detail':
          ipcRenderer.send('tab-update', 1)
          break
        case 'recurrings':
          ipcRenderer.send('tab-update', 2)
          break
        default:
          ipcRenderer.send('tab-update', 0)
      }
    }
  },
  mounted: function () {
    // Sets locale
    moment.locale(globSettings.language)
    document.documentElement.className = this.settings.theme
  },
  watch: {
    'settings.theme'(){
      document.documentElement.className = this.settings.theme
    }
  }
}).$mount('#app')
