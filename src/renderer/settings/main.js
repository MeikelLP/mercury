import Vue from 'vue'
import axios from 'axios'

// CSS
import '../assets/sass/master.sass'
// Components
import Settings from '@/settings/Settings.vue'
// nodeModules
import path from 'path'
import i18njs from 'i18njs'
import jsonfile from 'jsonfile'
import './../icons'
import './../filters'

let globSettings = jsonfile.readFileSync(path.join(__static, 'settings.json'))

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios

let app = new Vue({
  components: { Settings },
  template: '<Settings/>',
  data: function () { return {settings: globSettings} }
}).$mount('#app')
