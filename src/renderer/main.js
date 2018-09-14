import Vue from 'vue'
import axios from 'axios'

import './assets/sass/dark.sass'
import './assets/sass/light.sass'
// Components
import App from '@/App'
// nodeModules
import jsonfile from 'jsonfile'
import path from 'path'
import moment from 'moment'
import {ipcRenderer} from 'electron'
import './icons'
import './filters'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios

Vue.config.productionTip = false

let globSettings = jsonfile.readFileSync(path.join(__static, 'settings.json'))

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>',
  data: {
    settings: globSettings,
    accounts: [],
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
