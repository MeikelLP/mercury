<template lang="html">
  <div>
    <h2 class="title is-2">
      {{'MAIN_PANE.RECURRINGS.TITLE' | translate}}
    </h2>
    <!-- <recurring-bar /> -->
    <nav class="level">
      <div class="level-item">
        <a class="button is-info" @click="showRecModal('create')">
          <span class="icon">
            <font-awesome-icon icon="plus-circle" />
          </span>
          <span>{{ "MAIN_PANE.RECURRINGS.BAR.CREATE" | translate}}</span>
        </a>
      </div>
      <div class="level-item">
        <a class="button is-large is-danger" @click="showRecModal('launch')">
          <span class="icon">
            <font-awesome-icon icon="rocket" />
          </span>
          <span>{{ "MAIN_PANE.RECURRINGS.BAR.LAUNCH" | translate}}</span>
        </a>
      </div>
      <div class="level-item">
        <a class="button is-success" @click="showRecModal('edit')">
          <span class="icon">
            <font-awesome-icon icon="pencil-alt" />
          </span>
          <span>{{ "MAIN_PANE.RECURRINGS.BAR.EDIT" | translate}}</span>
        </a>
      </div>
    </nav>
    <!-- <recurring-modal /> -->
    <modal :active="recModalActive"
           :icon="modalConfig.icon"
           :close="closeRecModal"
           :title="'MAIN_PANE.RECURRINGS.MODAL.TITLE.'+modalConfig.translate| translate"
          v-if="modalConfig.icon">
      <div v-if="modalConfig.translate !== 'LAUNCH'">

        <custom-field fa="calendar">
          <input class="input" type="text" :placeholder="settings.dateFormat" v-model="newRecurringOperation.date">
        </custom-field>

        <div class="field has-addons">
          <div class="control">
            <a class="button is-primary"><font-awesome-icon icon="retweet" fixed-width/></a>
          </div>
          <div class="control">
            <input class="input" type="number" min="1" v-model="newRecurringOperation.offset">
          </div>
          <div class="control is-expanded is-primary">
            <span class="select is-fullwidth">
              <select v-model="newRecurringOperation.timespan">
                <option value="days">{{ (newRecurringOperation.offset > 1 ? "TIME_SPAN.PLURAL.":"TIME_SPAN.SINGULAR.")+"days"| translate}}</option>
                <option value="weeks">{{ (newRecurringOperation.offset > 1 ? "TIME_SPAN.PLURAL.":"TIME_SPAN.SINGULAR.")+"weeks"| translate}}</option>
                <option value="months">{{ (newRecurringOperation.offset > 1 ? "TIME_SPAN.PLURAL.":"TIME_SPAN.SINGULAR.")+"months"| translate}}</option>
                <option value="quarters">{{ (newRecurringOperation.offset > 1 ? "TIME_SPAN.PLURAL.":"TIME_SPAN.SINGULAR.")+"quarters"| translate}}</option>
                <option value="years">{{ (newRecurringOperation.offset > 1 ? "TIME_SPAN.PLURAL.":"TIME_SPAN.SINGULAR.")+"years"| translate}}</option>
              </select>
            </span>
          </div>
        </div>

        <div class="field has-addons">
          <div class="control">
            <a class="button is-primary" @click="newRecurringOperation.hasRepeat = !newRecurringOperation.hasRepeat; $forceUpdate()">
              <font-awesome-icon icon="check" v-if="newRecurringOperation.hasRepeat" fixed-width />
              <font-awesome-icon icon="times" v-else fixed-width />
            </a>
          </div>
          <div class="control">
            <input class="input" type="text" name="" :value="'OPERATION_PANE.PLACEHOLDERS.RECURRING' | translate" readonly :disabled="!newRecurringOperation.hasRepeat">
          </div>
          <div class="control">
            <input class="input" type="number" min="1" value="2" :disabled="!newRecurringOperation.hasRepeat">
          </div>
          <div class="control">
            <input class="input" type="text" :value="'TIME.TIME' | translate" style="padding-right: 0" readonly :disabled="!newRecurringOperation.hasRepeat">
          </div>
        </div>


        <custom-field fa="university">
          <span class="select is-fullwidth">
            <select v-model="newRecurringOperation.selectedAccount">
              <option v-for="account in accounts" :key="account.name" :value="account">{{account.name}}</option>
            </select>
          </span>
        </custom-field>

        <div class="field has-addons">
          <div class="control">
            <a class="button is-primary">
              <font-awesome-icon :icon="newRecurringOperation.type.icon" fixed-width />
            </a>
          </div>
          <div class="control is-expanded">
            <span class="select is-fullwidth">
              <select v-model="newRecurringOperation.type">
                <option value="" disabled>{{"OPERATION_TYPE.DEFAULT" | translate }}</option>
                <option :value="operationType" v-for="operationType in operationTypes" :key="operationType.key">
                  {{configTranslation(operationType.name)}}
                </option>
              </select>
            </span>
          </div>
        </div>

        <custom-field class="flex" :fa="currencyIcon(newRecurringOperation.selectedAccount.currency)">
          <input class="input" type="number" :placeholder="'0.00' | format" v-model="newRecurringOperation.amount">
        </custom-field>


        <custom-field class="flex" fa="building">
          <input class="input typeahead " id="op-benef" type="text" :placeholder="'OPERATION_PANE.PLACEHOLDERS.BENEFICIARY' | translate" v-model="newRecurringOperation.beneficiary"/>
        </custom-field>

        <custom-field class="flex" fa="flag">
          <input class="input typeahead " id="op-cat" type="text" :placeholder="'OPERATION_PANE.PLACEHOLDERS.CATEGORY' | translate" v-model="newRecurringOperation.category"/>
        </custom-field>

        <custom-field class="flex" fa="tag">
          <input class="input typeahead " id="op-label" type="text" :placeholder="'OPERATION_PANE.PLACEHOLDERS.LABEL' | translate" v-model="newRecurringOperation.label"/>
        </custom-field>

      </div>
      <div v-else>
        <p class="title">{{'MAIN_PANE.RECURRINGS.MODAL.TITLE.'+modalConfig.translate| translate}}</p>
        <form class="field has-addons">
          <div class="control flex">
            <input class="input is-warning has-text-warning" type="text" :value="'MAIN_PANE.RECURRINGS.MODAL.LAUNCH_FOR' | translate" readonly>
          </div>
          <div class="control">
            <input class="input is-warning" type="number" v-model="launch.offset" style="width: 5em"/>
          </div>
          <div class="control select is-warning">
            <select v-model="launch.timeSpan">
              <option value="days">{{ (launch.offset > 1 ? "TIME_SPAN.PLURAL.":"TIME_SPAN.SINGULAR.")+"days"| translate}}</option>
              <option value="weeks">{{ (launch.offset > 1 ? "TIME_SPAN.PLURAL.":"TIME_SPAN.SINGULAR.")+"weeks"| translate}}</option>
              <option value="months">{{ (launch.offset > 1 ? "TIME_SPAN.PLURAL.":"TIME_SPAN.SINGULAR.")+"months"| translate}}</option>
              <option value="quarters">{{ (launch.offset > 1 ? "TIME_SPAN.PLURAL.":"TIME_SPAN.SINGULAR.")+"quarters"| translate}}</option>
              <option value="years">{{ (launch.offset > 1 ? "TIME_SPAN.PLURAL.":"TIME_SPAN.SINGULAR.")+"years"| translate}}</option>
            </select>
          </div>
          <div class="control">
            <a class="button is-warning" :class="{'is-outlined': this.$root.settings.theme === 'dark', 'is-loading': launching}" @click="launchPending()">
              <font-awesome-icon icon="rocket" />
            </a>
          </div>
        </form>
      </div>
      <template slot="footer" v-if="modalConfig.translate !== 'LAUNCH'">
        <a class="button is-info left" @click="modalConfig.callback">{{'MAIN_PANE.RECURRINGS.MODAL.CONFIRM_BUTTON.'+modalConfig.translate| translate}}</a>
        <a class="button is-danger is-pulled-right" @click="closeRecModal()">{{'CANCEL'| translate}}</a>
        <p v-if="modalConfig.translate === 'EDIT'" class="level-item">
          <a class="button is-warning" @click="deleteRecuring(newRecurringOperation.id)">{{'DELETE' | translate}}</a>
        </p>
      </template>
      <template slot="footer" v-else>
        <button class="button is-outlined is-danger" @click="closeRecModal">
          {{'CANCEL'| translate}}
        </button>
      </template>
    </modal>
    <!-- <recurring-table /> -->
    <table class="table is-fullwidth is-striped is-hoverable">
      <tbody>
        <tr v-if="!recurrings.length">
          <td colspan="6" class="has-text-centered">{{'NO_DATA' | translate}}</td>
        </tr>
        <tr v-else
            v-for="recurring in recurrings"
            @click="toggleSelect(recurring)"
            @contextmenu="contextMenu(recurring)"
            :key="recurring.id"
            :class="{'is-selected': recurring.isSelected}">
          <td class="has-text-centered">{{recurring.date | date}}</td>
          <td class="has-text-centered"><font-awesome-icon :icon="recurring.type" /></td>
          <td class="has-text-centered">{{recurring.beneficiary}}</td>
          <td class="has-text-centered">{{recurring.category}}</td>
          <td class="has-text-centered">{{recurring.label}}</td>
          <td class="has-text-centered" :class="{'has-text-danger': recurring.amount < 0, 'has-text-success': recurring.amount >= 0}">{{recurring.amount}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Modal from '@/components/Common/Modal'
import CustomField from '@/components/Common/CustomField'

import { ipcRenderer, remote } from 'electron'
import moment from 'moment'
import Vue from 'vue'
import { mapState } from 'vuex'
import { Db } from '@/store'
import { currencyIcon, stateIcon } from '../../util/icons'
import { configTranslation } from '../../util/translation'
import OPERATION_TYPES from '../../../config/operation-types'

export default {
  components: {
    Modal,
    CustomField
  },
  data () {
    return {
      recModalActive: false,
      recurrings: [],
      modalConfig: {callback: () => {}},
      launching: false,
      launch: {},
      newRecurringOperation: {},
      operationTypes: OPERATION_TYPES
    }
  },
  computed: {
    ...mapState(['accounts', 'settings'])
  },
  methods: {
    getData: function () {
      this.recurrings = Db.exec('SELECT id,date,type,beneficiary,category,label,amount, account_name FROM Recurrings ORDER BY date ASC')
      this.recurrings.map(r => { r.isSelected = false; r.selectedAccount = this.accounts.find(a => a.name === r.account_name) })
    },
    currencyIcon (currency) {
      return currencyIcon(currency)
    },
    stateIcon (state) {
      return stateIcon(state)
    },
    contextMenu: function (recurring) {
      let vm = this
      let contextualMenu = new remote.Menu()
      let contextualContent = Db.exec(`SELECT account_name,date,offset,timespan,times FROM Recurrings WHERE id=${recurring.id}`)[0]
      const nextDate = moment(contextualContent.date, 'YYYY-MM-DD').add(contextualContent.offset, contextualContent.timespan).format(this.settings.dateFormat)
      contextualMenu.append(new remote.MenuItem({label: Vue.filter('translate')('MAIN_PANE.RECURRINGS.CONTEXTUAL.ACCOUNT') + ' : ' + contextualContent.account_name, enabled: false}))
      contextualMenu.append(new remote.MenuItem({label: Vue.filter('translate')('MAIN_PANE.RECURRINGS.CONTEXTUAL.NEXT') + ' : ' + nextDate, enabled: false}))
      contextualMenu.append(new remote.MenuItem({
        label: Vue.filter('translate')(
          (contextualContent.offset > 1)
            ? 'MAIN_PANE.RECURRINGS.CONTEXTUAL.RECURRENCES'
            : 'MAIN_PANE.RECURRINGS.CONTEXTUAL.RECURRENCE'
        ) + Vue.filter('translate')(
          (contextualContent.offset > 1)
            ? 'TIME_SPAN.PLURAL.'
            : 'TIME_SPAN.SINGULAR.' +
            contextualContent.timespan
        ),
        enabled: false
      }))
      if (contextualContent.times && contextualContent.times > 0) {
        contextualMenu.append(new remote.MenuItem({
          label: Vue.filter('translate')(
            contextualContent.times > 1
              ? 'MAIN_PANE.RECURRINGS.CONTEXTUAL.LEFT_PLURAL'
              : 'MAIN_PANE.RECURRINGS.CONTEXTUAL.LEFT',
            {'left': contextualContent.times}
          ),
          enabled: false
        }))
      }
      contextualMenu.append(new remote.MenuItem({type: 'separator'}))
      contextualMenu.append(new remote.MenuItem({
        label: Vue.filter('translate')('MAIN_PANE.RECURRINGS.BAR.LAUNCH'),
        click () { vm.launchPending(recurring.id, true) }
      }))
      contextualMenu.append(new remote.MenuItem({
        label: Vue.filter('translate')('MAIN_PANE.RECURRINGS.BAR.EDIT'),
        click () { vm.toggleSelect(recurring); vm.showRecModal('edit') }
      }))
      contextualMenu.append(new remote.MenuItem({
        label: Vue.filter('translate')('MAIN_PANE.RECURRINGS.BAR.DELETE'),
        click () { vm.deleteRecuring(recurring.id, true) }
      }))
      contextualMenu.popup(remote.getCurrentWindow())
    },

    launchPending: function (id = null, fromContext = false) {
      let operations = []
      if (id) {
        Db.launchPending(id)
      } else {
        this.launching = true
        let upperBound = moment().add(this.launch.offset, this.launch.timeSpan).format('YYYY-MM-DD')
        try {
          operations = Db.exec(`SELECT id FROM Recurrings WHERE date <="${upperBound}"`)
        } catch (e) {
          console.warn(e)
          operations.length = 0
        } finally {
          // IDEA: Progress bar of how many operations are running
          for (var i = 0; i < operations.length; i++) {
            Db.launchPending(operations[i].id)
          }
          const options = {
            title: Vue.filter('translate')('MAIN_PANE.RECURRINGS.POPUP.TITLE'),
            subtitle: Vue.filter('translate')(operations.length > 1 ? 'MAIN_PANE.RECURRINGS.POPUP.BODY_PLURAL' : 'MAIN_PANE.RECURRINGS.POPUP.BODY', {length: operations.length}),
            silent: true
          }
          ipcRenderer.send('notification', options)
          this.launching = false
        }
      }
      if (!fromContext) {
        this.closeRecModal()
      }
      this.getData()
      this.$root.$emit('launch-recurrings:success')
    },

    deleteRecuring: function (id = null, fromContext = false) {
      const options = {
        type: 'warning',
        title: Vue.filter('translate')('WARNING'),
        message: Vue.filter('translate')('MAIN_PANE.RECURRINGS.POPUP.CONFIRM_DELETE'),
        buttons: [Vue.filter('translate')('CONTINUE'), Vue.filter('translate')('CANCEL')],
        cancelId: 1
      }
      let confirm = ipcRenderer.sendSync('warning', options)
      if (confirm === 0) {
        id = Number(id)
        Db.deleteRec(id)
        if (!fromContext) {
          this.closeRecModal()
        }
        this.getData()
        this.$root.$emit('recurrings:delete:success')
      }
    },

    showRecModal: function (type) {
      let vm = this
      switch (type) {
        case 'create':
          this.modalConfig = {
            color: 'info',
            icon: 'plus-circle',
            translate: 'CREATE',
            callback: function () {
              console.log(vm.newRecurringOperation)
              Db.insertRecurringOperation(
                vm.newRecurringOperation.selectedAccount.name,
                [
                  vm.newRecurringOperation.amount,
                  vm.newRecurringOperation.type.key,
                  vm.newRecurringOperation.beneficiary,
                  vm.newRecurringOperation.category,
                  vm.newRecurringOperation.label,
                  vm.newRecurringOperation.date,
                  vm.newRecurringOperation.offset,
                  vm.newRecurringOperation.timespan,
                  vm.newRecurringOperation.times
                ],
                vm.settings.dateFormat
              )
              vm.$root.$emit('show-unsaved-tag')
              vm.closeRecModal()
              vm.getData()
              vm.newRecurringOperation = {
                date: moment().format(vm.settings.dateFormat),
                selectedAccount: vm.accounts[0],
                type: OPERATION_TYPES[0],
                offset: 1,
                timespan: 'days'
              }
            }
          }
          break
        case 'edit':
          if (!this.newRecurringOperation.id) {
            const options = {
              title: Vue.filter('translate')('MAIN_PANE.RECURRINGS.NO_DATA.TITLE'),
              subtitle: Vue.filter('translate')('MAIN_PANE.RECURRINGS.NO_DATA.BODY'),
              silent: false
            }
            ipcRenderer.send('notification', options)
          }
          let resSQL = Db.exec(`SELECT offset, timespan, times FROM Recurrings WHERE id=${this.newRecurringOperation.id}`)[0]
          if (resSQL.times !== null && resSQL.times > 0) {
            this.newRecurringOperation.hasRepeat = true
            this.newRecurringOperation.times = resSQL.times
          }
          this.newRecurringOperation.date = moment(this.newRecurringOperation.date).format(this.settings.dateFormat)
          this.newRecurringOperation.offset = resSQL.offset
          this.newRecurringOperation.timespan = resSQL.timespan
          this.modalConfig = {
            color: 'success',
            icon: 'pencil',
            translate: 'EDIT',
            callback: function () {
              Db.editRecurringOperation(
                vm.newRecurringOperation.id,
                vm.newRecurringOperation.selectedAccount.name,
                [
                  vm.newRecurringOperation.amount,
                  vm.newRecurringOperation.type.key,
                  vm.newRecurringOperation.beneficiary,
                  vm.newRecurringOperation.category,
                  vm.newRecurringOperation.label,
                  vm.newRecurringOperation.date,
                  vm.newRecurringOperation.offset,
                  vm.newRecurringOperation.timespan,
                  vm.newRecurringOperation.times
                ],
                vm.settings.dateFormat
              )
              vm.$root.$emit('show-unsaved-tag')
              vm.closeRecModal()
              vm.getData()
              vm.newRecurringOperation = {
                date: moment().format(vm.settings.dateFormat),
                selectedAccount: vm.accounts[0],
                type: OPERATION_TYPES[0],
                offset: 1,
                timespan: 'days'
              }
            }
          }
          break
        case 'launch':
          this.modalConfig = {
            color: 'warning',
            icon: 'rocket',
            translate: 'LAUNCH',
            callback: function () {}
          }
          break
        default:
          this.modalConfig = {
            callback: function () {}
          }
      }
      this.recModalActive = true
    },

    closeRecModal: function () {
      this.recModalActive = false
    },

    toggleSelect: function (recurring) {
      if (recurring.isSelected) {
        recurring.isSelected = false
        this.newRecurringOperation = {
          date: moment().format(this.settings.dateFormat),
          selectedAccount: this.accounts[0],
          type: OPERATION_TYPES[0],
          offset: 1,
          timespan: 'days'
        }
      } else {
        this.recurrings.map(recurring => { recurring.isSelected = false })
        recurring.isSelected = true
        this.newRecurringOperation = recurring
      }
      this.$root.$emit('edit-operation:clean')
      this.$forceUpdate()
    },
    configTranslation (name) {
      return configTranslation(name)
    }
  },
  created: function () {
    this.getData()
    this.launch = {
      offset: this.settings.defaultOffset,
      timeSpan: this.settings.defaultTimeSpan
    }
    this.newRecurringOperation = {
      date: moment().format(this.settings.dateFormat),
      selectedAccount: this.accounts[0],
      type: OPERATION_TYPES[0],
      offset: 1,
      timespan: 'days'
    }
  }
}
</script>
