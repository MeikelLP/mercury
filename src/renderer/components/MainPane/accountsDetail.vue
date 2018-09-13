<template lang="html">
  <div>
    <filter-bar />
    <p class="has-text-centered">
      <span class="has-text-danger">{{balanceDown | format}}</span>
      <span class="icon"><font-awesome-icon icon="balance-scale"/></span>
      <span class="has-text-success">{{balanceUp | format}}</span>
    </p>

    <table class="table is-fullwidth is-striped is-hoverable">
      <thead>
        <tr>
          <th>{{'MAIN_PANE.ACCOUNTS.TABLE.HEAD.STATE' | translate}}</th>
          <th>{{'MAIN_PANE.ACCOUNTS.TABLE.HEAD.DATE' | translate}}</th>
          <th>{{'MAIN_PANE.ACCOUNTS.TABLE.HEAD.TYPE' | translate}}</th>
          <th>{{'MAIN_PANE.ACCOUNTS.TABLE.HEAD.BENEFICIARY' | translate}}</th>
          <th>{{'MAIN_PANE.ACCOUNTS.TABLE.HEAD.CATEGORY' | translate}}</th>
          <th>{{'MAIN_PANE.ACCOUNTS.TABLE.HEAD.LABEL' | translate}}</th>
          <th>{{'MAIN_PANE.ACCOUNTS.TABLE.HEAD.DEBIT' | translate}}</th>
          <th>{{'MAIN_PANE.ACCOUNTS.TABLE.HEAD.COLLECTION' | translate}}</th>
        </tr>
      </thead>
        <tbody>
          <tr v-if="!data.length && !loading">
            <td colspan="8" class="has-text-grey has-text-centered">{{"NO_DATA" | translate}}</td>
          </tr>
          <tr v-else-if="loading">
            <td colspan="8" class="has-text-grey has-text-centered">
              <font-awesome-icon icon="spinner" spin />
              <a class="button is-loading has-background-black"></a>
            </td>
          </tr>
          <tr v-else-if="data.length && !loading"
              v-for="row in data"
              :key="row.id"
              :class="{'is-selected': row.isClicked, 'is-future': isFuture(row)}"
              @click="editRow(row)">
            <td class="has-text-centered"><font-awesome-icon :icon="stateIcon(row)"/></td>
            <td>{{row.date}}</td>
            <td class="has-text-centered"><font-awesome-icon :icon="row.type" /></td>
            <td><div class="is-not-too-large">{{row.beneficiary}}</div></td>
            <td>{{row.category}}</td>
            <td><div class="is-not-too-large">{{row.label}}</div></td>
            <td class="has-text-centered" :class="{'has-text-danger': !isFuture(row)}">
              {{ row.amount | format }}
            </td>
            <td class="has-text-centered" :class="{'has-text-success': !row.isClicked && !isFuture(row)}">
              {{row.amount >= 0 ? row.amount.toLocaleString($root.settings.language): ''}}
            </td>
          </tr>
        </tbody>
    </table>
  </div>
</template>

<script>
import FilterBar from '@/components/MainPane/accountsDetails/filterBar'

import moment from 'moment'
import Vue from 'vue'
import {stateIcon} from '../../util/icons'

export default {
  components: {
    FilterBar
  },
  data: function () {
    return {
      data: [],
      loading: true,
      orderBy: 'date',
      order: 'desc'
    }
  },
  computed: {
    language () {
      return this.$root.settings.language
    },
    balanceDown() {
      let val = 0
      this.data.filter(x => x.amount < 0).forEach(x => {
        val += Number(x.amount)
      })
      return val
    },
    balanceUp() {
      let val = 0
      this.data.filter(x => x.amount > 0).forEach(x => {
        val += Number(x.amount)
      })
      return val
    }
  },
  methods: {
    isFuture: function (row) {
      return moment(row.date, this.$root.settings.dateFormat).isAfter(moment())
    },
    stateIcon (row) {
      return stateIcon(row.state)
    },
    updateTable: function () {
      // Retrieve child states :
      this.loading = true
      this.data = []
      let filters = this.$children[0].filters
      let rows = this.$root.db.updateTable(filters.account.name, filters.date, filters.state, filters.amount)
      rows.map(r => {
        this.data.push({
          id: r[0],
          state: r[1],
          date: Vue.filter('date')(r[2]),
          type: r[3],
          beneficiary: r[4],
          category: r[5],
          label: r[6],
          amount: Number(r[7]),
          isClicked: false
        })
      })
      this.loading = false
    },

    editRow: function (row) {
      if (row.isClicked) {
        row.isClicked = false
        this.$root.$emit('edit-operation:clean')
      } else {
        row.isClicked = true
        row.selectedAccount = this.$children[0].filters.account
        this.$root.$emit('edit-operation', row)
      }
    },
    cancelEdit: function (operation) {
      this.data.map(row => { row.isClicked = false })
    },
    confirmEdit: function () {
      this.updateTable()
      this.$root.$emit('show-unsaved-tag')
    }
  },
  created: function () {
    this.loading = false
    this.$root.$on('add-operation', this.updateTable)
    this.$root.$on('update-filters', this.updateTable)
    this.$root.$on('launch-recurrings:success', this.updateTable)
    this.$root.$on('edit-operation:cancel', this.cancelEdit)
    this.$root.$on('edit-operation:confirm', this.confirmEdit)
  },
  mounted: function () {
    this.updateTable()
  }
}
</script>
