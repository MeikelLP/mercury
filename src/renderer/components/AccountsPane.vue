<template>
  <section class="section">
    currently using: {{lastFile}}
    <p class="title">
      {{'ACCOUNTS_PANE.DEFAULT'| translate}}
      <span class="icon">
        <font-awesome-icon icon="exclamation-circle" size="xs" class="has-text-warning" v-if="unsaved"/>
      </span>
    </p>
    <!-- createAccount modal -->
    <modal :active="createModalShown" icon="university" :close="closeModal" :title="'ACCOUNTS_PANE.MODAL.TITLE' | translate">
      <div class="field has-addons is-horizontal">
        <p class="control">
          <a class="button is-primary">
            <font-awesome-icon icon="tag" fixed-width/>
          </a>
        </p>
        <p class="control is-expanded">
          <input class="input" type="text" :class="{'is-danger': errorName}"
                 :placeholder="'ACCOUNTS_PANE.MODAL.PLACEHOLDER' | translate"
                 v-model="newAccount.name"
                 autofocus>
        </p>
      </div>
      <div class="field-body">
        <div class="field has-addons">
          <p class="control">
            <a class="button is-primary">
              <font-awesome-icon :icon="currencyIcon(this.newAccount.currency)" fixed-width />
            </a>
          </p>
          <p class="control is-expanded">
            <span class="select is-fullwidth">
              <select v-model="newAccount.currency">
                <option value="" disabled selected>{{'CURRENCIES.DEFAULT' | translate}}</option>
                <option :value="currency.key" v-for="currency in currencies" :key="currency.key">{{currencyTranslation(currency.name)}}
                </option>
                <option value="money">{{ 'CURRENCIES.OTHER' | translate }}</option>
              </select>
            </span>
          </p>
        </div>
        <div class="field has-addons">
          <div class="control">
            <p class="button is-tag is-primary">{{'ACCOUNTS_PANE.MODAL.CURRENT_AMOUNT' | translate }}</p>
          </div>
          <p class="control is-expanded">
            <input class="input" type="number" :placeholder="'0.00' | format" v-model="newAccount.amount">
          </p>
        </div>
      </div>
      <template slot="footer">
        <a class="button is-info is-outline" :class="{'loading': loading}" @click="createNewAccount()">
          {{'CREATE' | translate }}
        </a>
        <a class="button is-danger is-outlined" :class="{'loading': loading}" @click="closeModal()">
          {{"CANCEL" | translate }}
        </a>
      </template>
    </modal>

    <div class="columns is-multiline">
      <div class="column is-half" v-for="account in accounts" :key="account.name">
        <div class="card">
          <div class="card-header">
            <div class="card-header-icon">
              <font-awesome-icon icon="university"/>
            </div>
            <div class="card-header-title">
              {{account.name}}
            </div>
            <div class="card-header-icon">
              <a @click="deleteAccount(account)" class="has-text-danger">
                <font-awesome-icon icon="trash" size="sm"/>
              </a>
            </div>
          </div>
          <div class="card-content">
            <div class="content is-paddingless is-marginless">
              <p>
                {{ 'ACCOUNTS_PANE.CARDS.BANK'   | translate }}
                <span class="amount" :class="{ 'has-text-danger': account.inBank <= 0 }">
                  {{account.inBank | format}}
                  <span class="icon">
                    <font-awesome-icon size="sm" :icon="currencyIcon(account.currency)"/>
                  </span>
                </span>
              </p>
              <p>
                {{ 'ACCOUNTS_PANE.CARDS.TODAY'  | translate }}
                <span class="amount" :class="{ 'has-text-danger': account.today <= 0 }">
                  {{account.today | format}}
                  <span class="icon">
                    <font-awesome-icon size="sm" :icon="currencyIcon(account.currency)"/>
                  </span>
                </span>
              </p>
              <p>
                {{ 'ACCOUNTS_PANE.CARDS.FUTURE' | translate }}
                <span class="amount" :class="{ 'has-text-danger': account.future <= 0 }">
                  {{account.future | format}}
                  <span class="icon">
                    <font-awesome-icon size="sm" :icon="currencyIcon(account.currency)"/>
                  </span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="column is-half">
        <a class="button is-primary is-outlined is-fullwidth has-text-centered" @click="showCreateModal()">
          <span class="icon">
            <font-awesome-icon icon="plus-square"></font-awesome-icon>
          </span>
          <span>
            {{'ACCOUNTS_PANE.ADD' | translate }}
          </span>
        </a>
      </div>
    </div>
  </section>
</template>

<script>
import modal from '@/components/common/modal'

import {ipcRenderer, remote} from 'electron'
import Vue from 'vue'
import { currencyIcon } from '../util/icons'
import { configTranslation } from '../util/translation'
import CURRENCIES from '../../config/currencies.json'
import {Db} from '@/store'
import {mapState} from 'vuex'

export default {
  name: 'accounts-pane',
  components: {
    modal
  },
  data: function () {
    return {
      // Variables
      loading: false,
      errorName: false,
      createModalShown: false,
      newAccount: {
        currency: this.$store.state.settings.defaultCurrency
      },
      currencies: CURRENCIES
    }
  },
  computed: {
    unsaved(){
      return this.$store.state.unsaved
    },
    ...mapState(['accounts']),
    lastFile(){
      return this.$store.state.settings.lastfile
    }
  },
  methods: {
    createNewAccount: function () {
      this.loading = true
      this.newAccount.amount = Number((this.newAccount.amount) ? this.newAccount.amount : 0) || 0
      const account = {
        name: this.newAccount.name,
        inBank: this.newAccount.amount,
        today: this.newAccount.amount,
        future: this.newAccount.amount,
        currency: this.newAccount.currency
      }
      try {
        Db.addAccount(account.name, account.currency, account.amount)
        this.showUnsavedTag()
        this.loading = false
        this.closeModal()
      } catch (e) {
        this.errorName = (e.toString().indexOf('Accounts.name') !== -1)
      }
    },
    currencyIcon (currency) {
      return currencyIcon(currency)
    },
    deleteAccount: function (account) {
      const options = {
        type: 'warning',
        title: Vue.filter('translate')('WARNING'),
        message: Vue.filter('translate')('ACCOUNTS_PANE.CONFIRM.DELETE_ACCOUNT', {'name': account.name}), // (`You are about to delete the account "%{name}" \n\nAre you sure?`,{name: name}),
        buttons: [Vue.filter('translate')('CONTINUE'), Vue.filter('translate')('CANCEL')],
        cancelId: 1
      }
      const ipcr = (ipcRenderer.sendSync('warning', options))
      if (ipcr === 0) {
        this.$store.dispatch('deleteAccount', account.name)
      }
    },

    showUnsavedTag: function () {
      this.unsaved = true
      ipcRenderer.send('set-prevent-close', true)
    },

    hideUnsavedTag: function () {
      this.unsaved = false
      ipcRenderer.send('set-prevent-close', false)
    },

    showCreateModal: function () {
      this.createModalShown = true
    },

    closeModal: function () {
      this.newAccount = {}
      this.newAccount.currency = this.$store.state.settings.defaultCurrency
      this.createModalShown = false
    },
    currencyTranslation (currency) {
      return configTranslation(currency)
    }
  },
  created: function () {
    const vm = this

    let force = false
    remote.app.on('before-quit', function (evt) {
      console.log('before')
      if (vm.unsaved && !force) {
        setTimeout(() => {
          const options = {
            type: 'warning',
            title: Vue.filter('translate')('Warning !'),
            message: Vue.filter('translate')(`Are you sure to quit?`),
            detail: Vue.filter('translate')(`There are some unsaved modifications`),
            buttons: [Vue.filter('translate')('Save & Quit'), Vue.filter('translate')('Quit'), Vue.filter('translate')('Cancel')],
            cancelId: 2
          }
          let saving = ipcRenderer.sendSync('warning', options)
          if (saving === 0) {
            ipcRenderer.sendSync('save', true)
          } else if (saving === 1) {
            force = true
            ipcRenderer.send('set-prevent-close', false)
            ipcRenderer.send('quit')
          }
        }, 1)
        return false
      }
    })
  }
}
</script>
