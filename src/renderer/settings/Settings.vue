<template lang="html">
  <div :class="$root.settings.theme" id="app">
    <p class="title" style="-webkit-app-region: drag">
      <span style="margin-left:2%">
        <font-awesome-icon size="lg" class="has-text-info" icon="sliders-h" />
        <span>{{'SETTINGS.TITLE' | translate}}</span>
      </span>
      <a onclick="window.close()" class="button is-outlined is-danger is-pulled-right">
        <font-awesome-icon icon="times"/>
      </a>
    </p>
    <ul class="tabs is-fullwidth">
      <li v-for="tab in tabs" :key="tab.key" :class="{'is-active': activeTab === tab.component}">
        <a @click="activeTab = tab.component">
                    <span class="icon">
                      <font-awesome-icon :icon="tab.icon"/>
                    </span>
          <span>{{ 'SETTINGS.TABS.TITLES.'+ tab.translate | translate}}</span>
        </a>
      </li>
    </ul>
    <section class="section">
      <div class="container is-fluid">
        <div>
          <div>
            <transition name="fadeUp" mode="out-in">
              <component :is="activeTab"></component>
            </transition>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <a class="button is-outlined is-info is-pulled-right"  :class="{'is-loading' : loading}" @click="save()">
            <span class="icon">
              <font-awesome-icon icon="save"/>
            </span>&nbsp;
        {{ "SETTINGS.SAVE" | translate}}
      </a>
    </section>
  </div>
</template>

<script>
import General from './components/general'
import SavedValues from './components/savedValues'
import About from './components/about'

import {ipcRenderer} from 'electron'
import jsonfile from 'jsonfile'
import path from 'path'
import Vue from 'vue'

export default {
  data: function () {
    return {
      loading: false,
      activeTab: General,
      settings: this.$root.settings,
      tabs: [
        {component: General, icon: 'cogs', translate: 'GENERAL'},
        {component: SavedValues, icon: 'bookmark', translate: 'SAVED_VALUES'},
        // {key: 'exchange', icon: 'globe', translate: 'CURRENCIES'},
        {component: About, icon: 'heart', translate: 'ABOUT'}
      ]
    }
  },
  methods: {
    toggleTab: function (tab) {
      this.activeTab = tab
    },

    save: function () {
      let previousSettings = jsonfile.readFileSync(path.join(__static, 'settings.json'))
      this.loading = true
      this.settings.beneficiaries.filter(b => b !== null).sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase())
      })
      this.settings.categories.filter(c => c !== null).sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase())
      })
      delete this.settings['theme === \'dark\'']
      delete this.settings['theme === \'light\'']
      jsonfile.writeFile(path.join(__static, 'settings.json'), this.settings, {
        spaces: 2
      }, function (err) {
        if (err != null) {
          console.error(err)
        }
      })
      setTimeout(() => {
        window.close()
      }, 1000)
      if (previousSettings.defaultCurrency !== this.settings.defaultCurrency || previousSettings.language !== this.settings.language || previousSettings.theme !== this.settings.theme || previousSettings.dateFormat !== this.settings.dateFormat) {
        if (previousSettings.language !== this.settings.language) {
          const options = {
            body: Vue.filter('translate')('SETTINGS.TABS.GENERAL.LANGUAGE_UPDATE')
          }
          ipcRenderer.send('notification', options)
        }
        if (previousSettings.dateFormat !== this.settings.dateFormat) {
          const options = {
            body: Vue.filter('translate')('SETTINGS.TABS.GENERAL.DATE_UPDATE')
          }
          ipcRenderer.send('notification', options)
        }
        ipcRenderer.send('new-settings', this.settings)
      }
    }
  }
}
</script>
