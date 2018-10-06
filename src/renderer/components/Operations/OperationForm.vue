<template>
  <tr>
    <td>
      <input class="input is-small" v-model="newEntry.label" @input="update" @keydown.enter="submit">
    </td>
    <td>
      <div class="select is-small">
        <select class="is-small" v-model="newEntry.state" @input="update" @keydown.enter="submit">
          <option v-for="state in OPERATION_STATES" :key="state.key" :value="state">
            {{state.name | configTranslate}}
          </option>
        </select>
      </div>
    </td>
    <td id="new-entry-date-container">
      <b-datepicker size="is-small" v-model="newEntry.date" :readonly="false" :date-parser="parseDate" @input="update" @keydown.enter="submit"/>
    </td>
    <td>
      <input class="input is-small" v-model="newEntry.category" @input="update" @keydown.enter="submit">
    </td>
    <td>
      <div class="select is-small">
        <select class="is-small" v-model="newEntry.type" @input="update" @keydown.enter="submit">
          <option v-for="type in OPERATION_TYPES" :key="type.key" :value="type">
            {{type.name | configTranslate}}
          </option>
        </select>
      </div>
    </td>
    <td>
      <input class="input is-small" v-model="newEntry.amount" @input="update" @keydown.enter="submit">
    </td>
    <td>
      <div class="select is-small">
        <select class="is-small" v-model="newEntry.account" @input="update" @keydown.enter="submit">
          <option v-for="account in accounts" :key="account.id" :value="account">
            {{account.name}}
          </option>
        </select>
      </div>
    </td>
  </tr>
</template>

<script>
  import { mapState } from 'vuex'
  import OPERATION_STATES from '../../../config/operation-states'
  import OPERATION_TYPES from '../../../config/operation-types'

  export default {
    name: 'OperationForm',
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
      update () {
        this.$emit('input', this.newEntry)
      },
      submit() {
        // inject properties
        this.newEntry.currency = this.newEntry.account.currency

        this.$emit('submit', this.newEntry)
      },
      parseDate (dateString) {
        return Date.parse(dateString) // TODO implement parse by format from settings.dateFormat
      }
    },
    mounted () {
      this.newEntry.account = this.accounts[0]
    }
  }
</script>
