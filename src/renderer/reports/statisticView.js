import Vue from 'vue'
import axios from 'axios'

// CSS
import '../assets/sass/master.sass'
// Components
import StatisticView from '@/reports/statisticView.vue'
// nodeModules
import path from 'path'
import jsonfile from 'jsonfile'
import './../icons'
import './../filters'

let globSettings = jsonfile.readFileSync(path.join(__static, 'settings.json'))

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios

new Vue({
  components: { StatisticView },
  template: '<statistic-view />',
  data: function () { return {settings: globSettings} }
}).$mount('#app')
