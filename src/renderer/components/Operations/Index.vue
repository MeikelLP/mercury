<template>
  <section class="section">
    <h3 class="title is-3">TODO</h3>

    <button class="button is-primary" @click="createNewEntry = true" v-if="!createNewEntry">Create TODO</button>
    <button class="button is-danger" @click="createNewEntry = false" v-else>Cancel Creation TODO</button>

    <table class="table is-striped is-fullwidth is-narrow">
      <thead>
      <tr>
        <th>Label TODO</th>
        <th>State TODO</th>
        <th>Date TODO</th>
        <th>Category TODO</th>
        <th>Type TODO</th>
        <th>Amount TODO</th>
        <th>Account TODO</th>
      </tr>
      </thead>
      <tbody>
      <operation-form @submit="submitNew" v-if="createNewEntry"/>
      <tr v-for="entry in data" :key="entry.id">
        <td>{{entry.label}}</td>
        <td :title="getStateObjectForStateKey(entry.state).name | configTranslate">
          <font-awesome-icon :icon="getStateObjectForStateKey(entry.state).icon"/>
        </td>
        <td>{{new Date(entry.date) | date}}</td>
        <td>{{entry.category}}</td>
        <td>{{entry.type}}</td>
        <td class="has-text-right">
          {{entry.amount | format}}
          <font-awesome-icon :icon="getAccountCurrency(entry.account_name).icon"/>
        </td>
        <td>
          {{entry.account_name}}
        </td>
      </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
  import { search, getStateObjectForStateKey } from '../../services/OperationService'
  import { currencyIcon } from '../../util/icons'
  import { mapState } from 'vuex'

  import CURRENCIES from '../../../config/currencies'

  import OperationForm from './OperationForm'

  export default {
    name: 'Operations',
    components: {OperationForm},
    data () {
      return {
        data: [],
        createNewEntry: false
      }
    },
    methods: {
      submitNew (newEntry) {
        this.data.push(newEntry)
      },
      search () {
        this.data = search()
      },
      getAccountCurrency (accountName) {
        const currency = this.accounts.filter(x => x.name === accountName)[0].currency
        const currencyObj = CURRENCIES.filter(x => x.key === currency)[0]
        return currencyObj
      },
      getStateObjectForStateKey,
      currencyIcon
    },
    mounted () {
      this.search()
    },
    computed: {
      ...mapState(['settings', 'accounts'])
    }
  }
</script>
