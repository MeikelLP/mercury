<template lang="html">
  <div class="columns">
    <div class="column">
      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th class="has-text-centered" colspan="2">
              <span class="icon">
                <font-awesome-icon icon="building"/>
              </span>
              {{'SETTINGS.TABS.SAVED_VALUES.BENEFICIARIES' | translate}}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(beneficiary, $index) in settings.beneficiaries" :key="$index">
            <td>{{beneficiary}}</td>
            <td>
              <a class="is-pulled-right button is-danger is-outlined is-small" @click="deleteEntry($index, 'beneficiaries')">
                <font-awesome-icon icon="trash"/>
              </a>
            </td>
          </tr>
          <tr v-if="!settings.beneficiaries.length">
            <td>
              <i>{{'NO_DATA' | translate}}</i>
            </td>
          </tr>
        </tbody>
      </table>
    </div><div class="column">
      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th class="has-text-centered" colspan="2">
              <span class="icon">
                <font-awesome-icon icon="flag"/>
              </span>
              {{'SETTINGS.TABS.SAVED_VALUES.CATEGORIES' | translate}}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(category, $index) in settings.categories" :key="$index">
            <td>{{category}}</td>
            <td>
              <a class="is-pulled-right button is-danger is-outlined is-small" @click="deleteEntry($index, 'categories')">
                <font-awesome-icon icon="trash"/>
              </a>
            </td>
          </tr>
          <tr v-if="!settings.categories.length">
            <td>
              <i>
                {{'NO_DATA' | translate}}
              </i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      settings: this.$root.settings
    }
  },
  methods: {
    deleteEntry: function (index, entry) {
      this.settings[entry].splice(index, 1)
    }
  }
}
</script>
