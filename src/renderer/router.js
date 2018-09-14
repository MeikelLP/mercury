import Vue from 'vue'
import Router from 'vue-router'


// components
import MainPane from './components/MainPane'

// general
import Accounts from './components/AccountsPane'
import Operations from './components/OperationPane'
import Dashboard from './components/MainPane/dashboard'
import AccountDetails from './components/MainPane/accountsDetail'
import Recurrings from './components/MainPane/recurrings'

// reports
import ReportChrono from './reports/chronoView.vue'
import ReportStatistics from './reports/statisticView.vue'
import ReportBalance from './reports/balanceView.vue'

// settings
import Settings from './settings/Settings.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: MainPane
    },
    {
      path: '/accounts',
      name: 'Accounts',
      component: Accounts
    },
    {
      path: '/operations',
      name: 'Operations',
      component: Operations
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/accountDetails',
      name: 'Account Details',
      component: AccountDetails
    },
    {
      path: '/recurrings',
      name: 'Recurrings Operations',
      component: Recurrings
    },
    {
      path: '/report/chrono',
      name: 'Chrono Report',
      component: ReportChrono
    },
    {
      path: '/report/statistics',
      name: 'Statistics Report',
      component: ReportStatistics
    },
    {
      path: '/report/balance',
      name: 'Balance Report',
      component: ReportBalance
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    }
  ]
})
