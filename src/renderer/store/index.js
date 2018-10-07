import Vue from 'vue'
import Vuex from 'vuex'

import Database from '../assets/Database.class'
import jsonfile from 'jsonfile'
import path from 'path'
import { ipcRenderer } from 'electron'

Vue.use(Vuex)

const defaultSettings = {
  'dateFormat': 'DD/MM/YYYY',
  'defaultCurrency': 'eur',
  'language': 'en',
  'defaultOffset': 15,
  'defaultTimeSpan': 'day',
  'displayHelpers': false,
  'theme': 'light',
  'beneficiaries': [],
  'categories': [],
  'labels': [],
  'lastfile': null,
  'useDatepicker': true
}
const settings = jsonfile.readFileSync(path.join(__static, 'settings.json'))
if (Object.keys(settings).length === 0) {
  Object.assign(settings, defaultSettings)
}

export let Db = new Database(settings.lastfile) // TODO export only temporary

let accounts = []
try {
  accounts = Db.exec('SELECT * FROM accounts')
} catch (e) {
  console.log(e)
}

export const store = new Vuex.Store({
  state: {
    settings: settings,
    hasChanges: false,
    accounts
  },
  actions: {
    addAccount ({commit}, account) {
      commit('addAccount', account)
    },
    deleteAccount ({commit}, name) {
      const foundAccounts = state.accounts.filter(x => x.name === name)

      if (foundAccounts.length === 0) return
      try {
        Db.deleteAccount(name)
      } catch (e) {
        console.error('could not delete account', e)
        return
      }
      const index = state.accounts.indexOf(foundAccounts[0])
      commit('deleteAccount', index)
    }
  },
  mutations: {
    addAccount (state, account) {
      state.accounts.push(account)
    },
    removeAccount (state, index) {
      state.accounts = state.accounts.splice(index, 1)
    },
    refreshAccounts (state, accounts) {
      state.accounts = accounts
    }
  }
})

export function openDatabase (filePath = null) {
  console.log('opening database file ', filePath)
  Db = new Database(filePath)

  try {
    const accounts = Db.exec('SELECT * FROM accounts')
    store.commit('refreshAccounts', accounts)
  } catch (e) {
    if (e.message === 'Empty response') {
      // empty response is ok
      store.commit('refreshAccounts', [])
    } else {
      ipcRenderer.send('alert', {
        type: 'error',
        message: `Could not read from accounts in file ${filePath}. Maybe the file is not valid?`,
        error: e
      })
    }
  }
  store.state.hasChanges = false
  updateSettingsFile(filePath)
}

function updateSettingsFile (filePath) {
  if (filePath) {
    store.state.settings.lastfile = filePath
    jsonfile.writeFile(path.join(__static, 'settings.json'), store.state.settings, {
      spaces: 2
    }, function (err) {
      if (err) {
        ipcRenderer.send('alert', {
          type: 'error',
          message: `Could not save settings file at ${filePath}.`,
          error: e
        })
      }
    })
  } else {
    delete store.state.settings.lastfile
  }
}

export function saveDatabase (filePath) {
  Db.export(filePath)
  updateSettingsFile(filePath)
}
