<template>
  <section class="section column is-one-fifth">
    <article>
      <p class="title" id="op-title">{{isEditing ? "OPERATION_PANE.EDITING":"OPERATION_PANE.DEFAULT" | translate }}</p>
      <p class="subtitle level" v-if="isEditing">
        <a class="level-left button is-danger is-small" @click="deleteOperation()">
          <span class="icon">
            <font-awesome-icon icon="trash" />
          </span>
          <span>{{"DELETE" | translate}}</span>
        </a>
        <a class="level-right button is-link is-small" @click="inheritOperation()">
          <span class="icon">
            <font-awesome-icon icon="link" />
          </span>
          <span>{{"OPERATION_PANE.INHERIT" | translate}}</span>
        </a>
      </p>
      <div id="op-content">
        <custom-field fa="calendar">
          <input class="input " type="text"
            :placeholder="settings.dateFormat"
            v-model="newOperation.date"
            @keydown.up="addOneDay"
            @keydown.down="subtractOneDay"
            @keyup.enter="isEditing? confirmEdition():addOperation()">
        </custom-field>

        <custom-field :fa="operationCurrency">
          <input class="input" :class="{'is-danger': this.errors[1]}" type="text" :placeholder="'0.00' | format" pattern="-?[\d,.]*" v-model="newOperation.amount" @keyup.enter="isEditing? confirmEdition():addOperation()">
        </custom-field>

        <div class="field has-addons">
          <p class="control">
            <a class="button is-primary">
              <font-awesome-icon :icon="newOperation.type.icon" fixed-width />
            </a>
          </p>
          <p class="control is-expanded">
            <span class="select is-fullwidth">
              <select v-model="newOperation.selectedAccount">
                <option v-for="account in accounts" :key="account.name" :value="account">{{account.name}}</option>
                <option>asdsa dsaq asfrasf afaf a dad sadsadsad sad</option>
              </select>
            </span>
          </p>
        </div>

        <div class="field has-addons">
          <p class="control">
            <a class="button is-primary">
              <font-awesome-icon :icon="newOperation.type.icon" fixed-width />
            </a>
          </p>
          <p class="control is-expanded">
            <span class="select is-fullwidth">
              <select v-model="newOperation.type">
                <option value="" disabled>{{"OPERATION_TYPE.DEFAULT" | translate }}</option>

                <option :value="operationType" v-for="operationType in operationTypes" :key="operationType.key">
                  {{configTranslation(operationType.name)}}
                </option>
              </select>
            </span>
          </p>
        </div>

        <custom-field class="flex" fa="building">
          <input
            v-model="newOperation.beneficiary"
            type="text"
            class="input"
            :placeholder="'OPERATION_PANE.PLACEHOLDERS.BENEFICIARY' | translate"
            @keyup.enter="isEditing? confirmEdition():addOperation()"
            @focus="beneficiaryInput = true"
            @blur="beneficiaryInput = false"
            @keyup.down="newOperation.beneficiary = bfiltered[0]" />
          <transition-group name="collapse" tag="ul" class="Results" v-if="bfiltered">
            <li v-for="(item, key) in bfiltered" :key="key">
                <small>{{ item }}</small>
            </li>
          </transition-group>
         </custom-field>

        <custom-field class="flex" fa="flag">
          <input
            v-model="newOperation.category"
            type="text"
            class="input"
            :placeholder="'OPERATION_PANE.PLACEHOLDERS.CATEGORY' | translate"
            @keyup.enter="isEditing? confirmEdition():addOperation()"
            @focus="categoryInput = true"
            @blur="categoryInput = false"
            @keyup.down="newOperation.category = cfiltered[0]" />
          <transition-group name="collapse" tag="ul" class="Results" v-if="cfiltered">
            <li v-for="(item, key) in cfiltered" :key="key">
                <small>{{ item }}</small>
            </li>
          </transition-group>
        </custom-field>

        <custom-field class="flex" fa="tag">
          <input
            v-model="newOperation.label"
            type="text"
            class="input"
            :placeholder="'OPERATION_PANE.PLACEHOLDERS.LABEL' | translate"
            @keyup.enter="isEditing? confirmEdition():addOperation()"
            @focus="labelInput = true"
            @blur="labelInput = false"
            @keyup.down="newOperation.label = lfiltered[0]" />
          <transition-group name="collapse" tag="ul" class="Results" v-if="lfiltered">
            <li v-for="(item, key) in lfiltered" :key="key">
                <small>{{ item }}</small>
            </li>
          </transition-group>
        </custom-field>

        <div class="field is-grouped">
          <p class="control">{{"State" | translate }}:</p>
          <p class="control">
            <a class="button is-outlined is-primary is-small"
               @click="toggleState(newOperation.state)"
               @keyup.enter="isEditing ? confirmEdition() : addOperation()"
               :title="configTranslation(newOperation.state.name)">
               <font-awesome-icon size="sm" :icon="newOperation.state.icon"/>
            </a>
          </p>
          <div class="control field has-addons flex">
            <p class="control" v-for="state in states" :key="state.key">
              <a class="button is-outlined is-dark is-small" :title="configTranslation(state.name)">
                <font-awesome-icon size="sm" :icon="state.icon"/>
              </a>
            </p>
          </div>
        </div>

        <div class="level">
            <a class="level-left button is-small is-info is-outlined" id="op-add-btn" @click="isEditing? confirmEdition():addOperation()">
              <span id='op-confirm'>{{isEditing ? "OPERATION_PANE.EDIT":"OPERATION_PANE.ADD" | translate }} </span>
              <span class="icon">
                <font-awesome-icon icon="check"/>
              </span>
            </a>
            <a class="level-right button is-small is-danger is-outlined" @click="cancelOperation()">
              <span>{{"CANCEL" | translate }} </span>
              <span class="icon">
                <font-awesome-icon icon="times"/>
              </span>
            </a>
        </div>
      </div>
    </article>
  </section>
</template>
<script>
import CustomField from './common/customField'

import {ipcRenderer} from 'electron'
import jsonfile from 'jsonfile'
import moment from 'moment'
import path from 'path'
import Vue from 'vue'
import { stateIcon, currencyIcon } from '../util/icons'
import { configTranslation } from '../util/translation'
import { parseLocalizedString } from '../filters'
import OPERATION_STATES from '../../config/operation-states'
import OPERATION_TYPES from '../../config/operation-types'

import { mapState } from 'vuex'
import { Db } from '@/store'

export default {
  name: 'operation-pane',
  components: { CustomField },
  data () {
    return {
      beneficiaryInput: false,
      categoryInput: false,
      labelInput: false,
      isEditing: false,
      states: OPERATION_STATES,
      helper: '-',
      newOperation: {},
      errors: [false, false, false],
      operationTypes: OPERATION_TYPES.sort((a, b) => configTranslation(a).localeCompare(configTranslation(b)))
    }
  },
  computed: {
    operationCurrency: function () {
      if (this.newOperation.selectedAccount) {
        return currencyIcon(this.newOperation.selectedAccount.currency)
      }
      return this.settings.defaultCurrency
    },
    stateIcon () {
      return stateIcon(this.newOperation.state)
    },
    bfiltered: function () {
      if (this.beneficiaryInput && this.newOperation.beneficiary && this.newOperation.beneficiary.length >= 1) {
        return this.settings.beneficiaries.filter(item => {
          if (item !== null && item !== undefined && item.toString().indexOf(this.newOperation.beneficiary) !== -1) {
            return item.toLowerCase()
          }
        }).slice(0, 5)
      }
    },
    cfiltered: function () {
      if (this.categoryInput && this.newOperation.category && this.newOperation.category.length >= 1) {
        return this.settings.categories.filter(item => {
          if (item !== null && item !== undefined && item.toString().indexOf(this.newOperation.category) !== -1) {
            return item.toLowerCase()
          }
        }).slice(0, 5)
      }
    },

    lfiltered: function () {
      if (this.labelInput && this.newOperation.label && this.newOperation.label.length >= 1) {
        return this.settings.labels.filter(item => {
          if (item !== null && item !== undefined && item.toString().indexOf(this.newOperation.label) !== -1) {
            return item.toLowerCase()
          }
        }).slice(0, 5)
      }
    },
    ...mapState(['accounts', 'settings'])
  },
  methods: {
    toggleState: function (state) {
      this.newOperation.state = this.states[(this.states.indexOf(state) === 2) ? 0 : this.states.indexOf(state) + 1]
    },

    addOneDay: function () {
      this.newOperation.date = moment(this.newOperation.date, this.settings.dateFormat).add(1, 'days').format(this.settings.dateFormat)
    },

    subtractOneDay: function () {
      this.newOperation.date = moment(this.newOperation.date, this.settings.dateFormat).subtract(1, 'days').format(this.settings.dateFormat)
    },

    isValid: function () {
      this.errors = [false, false, false]

      // if (!moment(this.newOperation.date).isValid()) {
      //   console.log(moment(this.newOperation.date).invalidAt())
      //   this.errors[0] = true
      // }
      if (!this.newOperation.amount || !parseFloat(this.newOperation.amount)) {
        this.errors[1] = true
      }
      if (!this.newOperation.selectedAccount.name) {
        this.errors[2] = true
      }

      return (!this.errors[0] && !this.errors[1] && !this.errors[2])
    },

    addOperation: function () {
      if (this.isValid()) {
        // Go to right tab
        this.$root.$emit('toggle-tab', 1)

        let data = [
          this.newOperation.date,
          this.newOperation.state.key,
          this.newOperation.beneficiary,
          this.newOperation.category,
          this.newOperation.label,
          parseLocalizedString(this.newOperation.amount),
          this.newOperation.type.key
        ]

        if (!this.settings.beneficiaries.find(b => b === this.newOperation.beneficiary) && this.newOperation.beneficiary !== '' && this.newOperation.beneficiary !== null && this.newOperation.beneficiary !== undefined) {
          this.settings.beneficiaries.push(this.newOperation.beneficiary)
        }
        if (!this.settings.labels.find(b => b === this.newOperation.label) && this.newOperation.label !== '' && this.newOperation.label !== null && this.newOperation.label !== undefined) {
          this.settings.labels.push(this.newOperation.label)
        }
        if (!this.settings.categories.find(b => b === this.newOperation.category) && this.newOperation.category !== '' && this.newOperation.category !== null && this.newOperation.category !== undefined) {
          this.settings.categories.push(this.newOperation.category)
        }
        jsonfile.writeFile(path.join(__static, 'settings.json'), this.settings, {
          spaces: 2
        }, function (err) {
          if (err != null) {
            console.error(err)
          }
        })
        Db.insertOperation(this.newOperation.selectedAccount.name, data, this.settings.dateFormat)
        this.cleanOperation()
        this.$root.$emit('add-operation')
        this.$root.$emit('show-unsaved-tag')
      }
    },

    inheritOperation: function () {
      let oldOperation = Vue.util.extend({}, this.newOperation)
      this.newOperation = {
        date: moment().format(this.settings.dateFormat),
        state: OPERATION_STATES[0],
        beneficiary: oldOperation.beneficiary,
        category: oldOperation.category,
        label: oldOperation.label,
        amount: oldOperation.amount,
        type: oldOperation.type,
        selectedAccount: oldOperation.selectedAccount
      }
      this.isEditing = false
      this.$root.$emit('edit-operation:cancel')
    },

    deleteOperation: function () {
      let confirm
      const options = {
        type: 'warning',
        title: Vue.filter('translate')('WARNING'),
        message: Vue.filter('translate')('OPERATION_PANE.CONFIRM'),
        buttons: [Vue.filter('translate')('CONTINUE'), Vue.filter('translate')('CANCEL')],
        cancelId: 1
      }
      confirm = ipcRenderer.sendSync('warning', options)
      if (confirm === 0) {
        Db.deleteOperation(this.newOperation.id)
        this.endOperation('confirm')
        this.$root.$emit('show-unsaved-tag')
      }
    },

    endOperation: function (type) {
      this.cleanOperation()
      this.$root.$emit('edit-operation:' + type)
    },

    cleanOperation: function () {
      this.isEditing = false
      this.newOperation = {
        date: moment().format(this.settings.dateFormat),
        selectedAccount: this.accounts[0],
        type: OPERATION_TYPES[0],
        state: OPERATION_STATES[0]
      }
    },

    cancelOperation: function () {
      this.endOperation('cancel')
    },

    editOperation: function (operation) {
      const op = Object.assign({}, operation);
      op.state = OPERATION_STATES.filter(x => x.key === op.state)[0]
      op.type = OPERATION_TYPES.filter(x => x.key === op.type)[0]
      op.selectedAccount = this.accounts.find(a => a.name === op.selectedAccount.name)
      this.newOperation = op
      this.isEditing = true
    },

    confirmEdition: function () {
      if (this.isValid()) {
        if (this.newOperation.id) {
          let data = [
            this.newOperation.selectedAccount.name,
            this.newOperation.date,
            this.newOperation.state.key,
            this.newOperation.beneficiary,
            this.newOperation.category,
            this.newOperation.label,
            this.newOperation.amount,
            this.newOperation.type.key
          ]
          if (!this.settings.beneficiaries.find(b => b === this.newOperation.beneficiary) && this.newOperation.beneficiary !== '') {
            this.settings.beneficiaries.push(this.newOperation.beneficiary)
          }
          if (!this.settings.labels.find(b => b === this.newOperation.label) && this.newOperation.label !== '') {
            this.settings.labels.push(this.newOperation.label)
          }
          if (!this.settings.categories.find(b => b === this.newOperation.category) && this.newOperation.category !== '') {
            this.settings.categories.push(this.newOperation.category)
          }
          jsonfile.writeFile(path.join(__static, 'settings.json'), this.settings, {
            spaces: 2
          }, function (err) {
            if (err != null) {
              console.error(err)
            }
          })
          Db.editOperation(this.newOperation.id, data, this.settings.dateFormat)
          this.endOperation('confirm')
        } else {
          console.warn('NO ID ON EDITION !')
        }
        // TODO : add typeahead categories (HTMLEventHandler.js:100)
      }
    },
    configTranslation (name) {
      return configTranslation(name)
    }
  },
  created: function () {
    this.$root.$on('update-accounts', function () { this.newOperation.selectedAccount = this.accounts[0] })
    this.$root.$on('edit-operation', this.editOperation)
    this.$root.$on('edit-operation:clean', this.cleanOperation)

    this.$root.$on('update-accounts-list:success', this.$forceUpdate)
    this.newOperation = {
      date: moment().format(this.settings.dateFormat),
      selectedAccount: this.accounts[0] || {currency: this.settings.defaultCurrency},
      type: OPERATION_TYPES[0],
      state: OPERATION_STATES[0]
    }
  }
}
</script>
