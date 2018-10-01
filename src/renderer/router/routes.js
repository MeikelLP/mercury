// components
import MainPane from '../components/MainPane'

// general
import Accounts from '../components/AccountsPane'
import Operations from '../components/OperationPane'
import Dashboard from '../components/MainPane/Dashboard'
import AccountDetails from '../components/MainPane/AccountsDetail'
import Recurrings from '../components/MainPane/Recurrings'

// Reports
import ReportChrono from '../components/Reports/ChronoView.vue'
import ReportStatistics from '../components/Reports/StatisticView.vue'
import ReportBalance from '../components/Reports/BalanceView.vue'

// Settings
import Settings from '../components/Settings.vue'

export default [
  {
    path: '/',
    name: 'Home',
    component: MainPane
  },
  {
    path: '/accounts',
    name: '$.MAIN.TOUCHBAR.TABS.ACCOUNTS',
    component: Accounts,
    meta: {
      requiresAccount: false,
      group: '$GENERAL',
      icon: 'users',
      position: 0
    }
  },
  {
    path: '/operations',
    name: '$OPERATION_PANE.DEFAULT',
    component: Operations,
    meta: {
      requiresAccount: true,
      group: '$GENERAL',
      icon: 'database',
      position: 1
    }
  },
  {
    path: '/accountDetails',
    name: '$MAIN_PANE.TABS.ACCOUNTS',
    component: AccountDetails,
    meta: {
      requiresAccount: true,
      group: '$GENERAL',
      icon: 'chart-bar',
      position: 3
    }
  },
  {
    path: '/recurrings',
    name: '$MAIN_PANE.TABS.RECURRINGS',
    component: Recurrings,
    meta: {
      requiresAccount: true,
      group: '$GENERAL',
      icon: 'recycle',
      position: 4
    }
  },
  {
    path: '/report/chrono',
    name: '$MAIN_PANE.DASHBOARD.ACCESSES.CHRONOCHART',
    component: ReportChrono,
    meta: {
      requiresAccount: true,
      group: '$.MAIN.MENU.REPORTS.DEFAULT',
      icon: 'chart-area',
      position: 0
    }
  },
  {
    path: '/report/statistics',
    name: '$MAIN_PANE.DASHBOARD.ACCESSES.STATISTIC',
    component: ReportStatistics,
    meta: {
      requiresAccount: true,
      group: '$.MAIN.MENU.REPORTS.DEFAULT',
      icon: 'chart-pie',
      position: 1
    }
  },
  {
    path: '/report/balance',
    name: '$MAIN_PANE.DASHBOARD.ACCESSES.BALANCE',
    component: ReportBalance,
    meta: {
      requiresAccount: true,
      group: '$.MAIN.MENU.REPORTS.DEFAULT',
      icon: 'chart-line',
      position: 2
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '*',
    redirect: { path: '/' }
  }
]
