<template>
  <section class="section">
    <h3 class="title is-3">TODO</h3>

    <router-link class="button is-primary" to="#create" v-if="!createNewEntry">Create TODO</router-link>
    <router-link class="button is-danger" :to="$route.path" v-else>Cancel Creation TODO</router-link>

    <b-dropdown hoverable class="is-pulled-right is-right">
      <button class="button is-info" slot="trigger">
        <span>Columns!</span>
        <span class="icon is-small">
          <font-awesome-icon icon="chevron-down" size="sm" fixed-width/>
        </span>
      </button>

      <b-dropdown-item v-for="(column, index) in columns" :key="index" custom>
        <b-checkbox v-model="column.visible">
          {{ column.label }}
        </b-checkbox>
      </b-dropdown-item>
    </b-dropdown>
    <operation-form @submit="submitNew" v-if="createNewEntry" :columns="columns" @cancel="cancelNew"/>
    <b-table :data="data">
      <template slot-scope="props">
        <b-table-column v-for="(column, i) in columns"
                        :key="i"
                        :label="column.label"
                        :visible="column.visible"
                        :numeric="column.numeric">
          {{ column.format ? column.format(props.row[column.field], props.row) : props.row[column.field] }}
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>

<script>
  import { search, getStateObjectForStateKey } from '../../services/OperationService'
  import { currencyIcon } from '../../util/icons'
  import { mapState } from 'vuex'
  import { translateOperationType, translateOperationState } from '../../util/translation'
  import { format } from '../../filters'

  import CURRENCIES from '../../../config/currencies'

  import OperationForm from './OperationForm'

  export default {
    name: 'Operations',
    components: {OperationForm},
    data () {
      return {
        data: [],
        columns: [
          {
            field: 'label',
            label: 'Label TODO',
            visible: true
          },
          {
            field: 'state',
            label: 'State TODO',
            visible: true,
            format: translateOperationState
          },
          {
            field: 'date',
            label: 'Date TODO',
            visible: true,
            format: (date) => date.toLocaleDateString()
          },
          {
            field: 'category',
            label: 'Category TODO',
            visible: true
          },
          {
            field: 'type',
            label: 'Type TODO',
            visible: true,
            format: translateOperationType
          },
          {
            field: 'amount',
            label: 'Amount TODO',
            visible: true,
            numeric: true,
            format: (num, obj) => format(num) + ' ' + this.getAccountCurrency(obj.account_name).char
          },
          {
            field: 'account_name',
            label: 'Account TODO',
            visible: true
          },
        ]
      }
    },
    methods: {
      submitNew (newEntry) {

        this.data.push(newEntry)
        this.$router.push(this.$route.path)
      },
      cancelNew () {
        this.$router.push(this.$route.path)
      },
      search () {
        this.data = search()
        this.data.forEach(x => {
          x.date = new Date(x.date)
        })
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
      ...mapState(['settings', 'accounts']),
      createNewEntry () {
        return this.$route.hash === '#create'
      }
    },
    watch: {
      '$route' (to, from) {
        this.createNewEntry = to.hash === '#create'
      }
    }
  }
</script>
