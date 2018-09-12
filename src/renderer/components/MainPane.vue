<template lang="html">
  <div class="tile is-parent  is-2 is-paddingless" id="main-pane">
    <div class="tile is-parent is-vertical is-paddingless">
      <section class="tile is-child hero notification is-paddingless is-dark is-bottomless">
        <div class="tabs is-boxed is-small is-fullwidth is-bottomless">
          <ul>
            <li class="tab" v-for="tab in tabs" :class="{'is-active': activeTab === tab.component}" :key="tab.name">
              <a @click="activeTab = tab.component">
                <span class="icon">
                  <font-awesome-icon size="sm" :icon="tab.icon" />
                </span>
                {{ configTranslation(tab.name) }}
              </a>
            </li>
          </ul>
        </div>
        <div class="tile data" id="dashboard">
          <div class="tile is-parent is-vertical ">
            <div class="hero is-marginless">
              <!-- NO DATA -->
              <div class="container has-text-centered" v-show="!$root.accounts.length" style="width: 64vw; padding-top:25%">
                <p class="title">{{ 'MAIN_PANE.NO_DATA.TITLE' | translate}}</p>
                <p class="subtitle" v-html="doTranslate('MAIN_PANE.NO_DATA.SUBTITLE')"></p>
              </div>

              <div class="container" id="mainScreen" v-show="$root.accounts.length">
                <!-- TABS -->
                <component :is="activeTab" v-if="activeTab"></component>
              </div>
            </div>
          </div>
        </div>

      </section>
      <section id="chart-area" class="tile is-child hero notification is-paddingless is-black">
        <div>
          <canvas id="chronoChart" height="75" style="position:relative; top:1rem;"></canvas>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
// Components
import Dashboard from '@/components/MainPane/dashboard'
import AccountsDetail from '@/components/MainPane/accountsDetail'
import Recurrings from '@/components/MainPane/recurrings'

// Third party
import moment from 'moment'
import {ipcRenderer} from 'electron'
import ChronoChart from '@/assets/ChronoChart.class'
import chartJS from 'chart.js' // eslint-disable-line
import { translate } from '../filters'
import { configTranslation } from '@/util/translation'

export default {
  name: 'main-pane',
  data: function () {
    return {
      activeTab: Dashboard,
      reload: 1,
      chronoChart: null,
      tabs: [
        {
          name: '$MAIN_PANE.TABS.DASHBOARD',
          component: Dashboard,
          icon: 'tachometer-alt'
        },
        {
          name: '$MAIN_PANE.TABS.ACCOUNTS',
          component: AccountsDetail,
          icon: 'th-list'
        },
        {
          name: '$MAIN_PANE.TABS.RECURRINGS',
          component: Recurrings,
          icon: 'recycle'
        }
      ]
    }
  },
  methods: {
    doTranslate (value, option) {
      return translate(value, option)
    },
    openfile: function () {
      ipcRenderer.send('open-file')
    },
    configTranslation(str) { return configTranslation(str) },
    showCreateModal: function () {
      // Go for AccountsPane component
      this.$root.$children[0].$children[0].showCreateModal()
    },

    switchTab: function (args) {
      switch (args) {
        case 0:
          this.tabToggle('dashboard')
          break
        case 1:
          this.tabToggle('accounts-detail')
          break
        case 2:
          this.tabToggle('recurrings')
          break
        default:
          this.tabToggle('dashboard')
      }
    },

    refreshChronochart: function () {
      try {
        this.chronoChart.refresh(this.$root.accounts)
      } catch (e) {
        console.error(e)
      }
    },

    reloadChronochart: function () {
      this.chronoChart = new ChronoChart(document.getElementById('chronoChart'), this.$root.accounts, this.$root.db)
    }
  },
  created: function () {
    const self = this
    moment.locale(this.$root.settings.language)

    this.$root.$on('toggle-tab', this.switchTab)
    this.$root.$on('add-operation', this.refreshChronochart)
    this.$root.$on('edit-operation:cancel', this.refreshChronochart)
    this.$root.$on('edit-operation:confirm', this.refreshChronochart)

    ipcRenderer.on('toggle', function (event, args) {
      switch (args) {
        default:
        case 0:
          self.activeTab = Dashboard
          break
        case 1:
          self.activeTab = AccountsDetail
          break
        case 2:
          self.activeTab = Recurrings
          break
      }
    })

    ipcRenderer.on('open-recurring', function () {
      tabToggle('recurrings')
    })

    ipcRenderer.on('open-detail', function () {
      tabToggle('accounts-detail')
    })

    ipcRenderer.on('new-settings', function () {
      tabToggle('dashboard')
    })

    // This refers to root !!!!
    this.$root.$on('update-accounts', this.reloadChronochart)
    this.$root.$on('update-accounts-list:success', this.reloadChronochart)
    this.$root.$on('launch-recurrings:success', this.refreshChronochart)
  },
  mounted: function () {
    this.chronoChart = new ChronoChart(document.getElementById('chronoChart'), this.$root.accounts, this.$root.db)
  }
}
</script>
