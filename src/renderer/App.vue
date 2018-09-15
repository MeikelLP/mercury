<template>
  <div id="app">
    <div class="columns">
      <div class="column is-one-fifth">
        <sidebar/>
      </div>
      <div class="column">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import path from 'path'

  import Database from './assets/Database.class'
  import {ipcRenderer} from 'electron'
  import jsonfile from 'jsonfile'
  import Sidebar from './components/Sidebar'

  export default {
    name: 'mercury',
    components: {
      Sidebar
    },
    methods: {
      updateAccountsList: function () {
        try {
          this.$root.accounts = this.$root.db.exec('SELECT * FROM Accounts')
        } catch (e) {
          console.warn(e)
          this.$root.accounts = []
        }
        this.$root.$emit('update-accounts-list:success')
      }
    },
    created: function () {
      this.updateAccountsList()

      this.$root.$on('add-operation', this.updateAccountsList)
      this.$root.$on('edit-operation:confirm', this.updateAccountsList)

      let vm = this
      ipcRenderer.on('new-settings', (event, arg) => {
        vm.$root.settings = arg
      })

      ipcRenderer.on('selected-file', (event, arg) => {
        vm.$root.db = new Database(arg)
        vm.$root.settings.lastfile = arg
        jsonfile.writeFile(path.join(__static, 'settings.json'), vm.$root.settings, {
          spaces: 2
        }, (err) => {
          if (err) console.warn(err)
        })
        vm.updateAccountsList()
      })
    }
  }
</script>
