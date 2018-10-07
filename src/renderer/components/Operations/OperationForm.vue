<template>

  <table class="table is-striped is-fullwidth is-narrow" @keydown.esc="cancel">
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
    <tr>
      <td>
        <input class="input is-small" ref="label" v-model="newEntry.label" @keydown.enter="submit">
      </td>
      <td>
        <div class="select is-small">
          <select class="is-small" v-model="newEntry.state" @keydown.enter="submit">
            <option v-for="state in OPERATION_STATES" :key="state.key" :value="state">
              {{state.name | configTranslate}}
            </option>
          </select>
        </div>
      </td>
      <td id="new-entry-date-container">
        <b-datepicker size="is-small" v-model="newEntry.date" :readonly="false" :date-parser="parseDate"
                      @keydown.enter="submit"/>
      </td>
      <td>
        <input class="input is-small" v-model="newEntry.category" @keydown.enter="submit">
      </td>
      <td>
        <div class="select is-small">
          <select class="is-small" v-model="newEntry.type" @keydown.enter="submit">
            <option v-for="type in OPERATION_TYPES" :key="type.key" :value="type">
              {{type.name | configTranslate}}
            </option>
          </select>
        </div>
      </td>
      <td>
        <input class="input is-small" v-model="newEntry.amount" @keydown.enter="submit">
      </td>
      <td>
        <div class="select is-small">
          <select class="is-small" v-model="newEntry.account" @keydown.enter="submit">
            <option v-for="account in accounts" :key="account.id" :value="account">
              {{account.name}}
            </option>
          </select>
        </div>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
  import { mapState } from 'vuex'
  import OPERATION_STATES from '../../../config/operation-states'
  import OPERATION_TYPES from '../../../config/operation-types'

  export default {
    name: 'OperationForm',
    props: {
      columns: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        OPERATION_STATES,
        OPERATION_TYPES,
        newEntry: {
          label: '',
          state: OPERATION_STATES[0],
          date: new Date(),
          type: OPERATION_TYPES[0],
          account: null
        }
      }
    },
    computed: {
      ...mapState(['settings', 'accounts'])
    },
    methods: {
      submit () {
        // inject properties
        this.newEntry.currency = this.newEntry.account.currency
        this.newEntry.account_name = this.newEntry.account.name
        this.newEntry.amount = parseFloat(this.newEntry.amount)
        this.newEntry.state = this.newEntry.state.key
        this.newEntry.type = this.newEntry.type.key

        this.$emit('submit', this.newEntry)
      },
      cancel () {
        this.$emit('cancel', {})
      },
      parseDate (dateString) {
        return Date.parse(dateString) // TODO implement parse by format from settings.dateFormat
      }
    },
    mounted () {
      this.newEntry.account = this.accounts[0]
      this.$refs.label.focus()
    }
  }
</script>
