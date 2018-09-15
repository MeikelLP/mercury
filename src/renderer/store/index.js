import Vue from 'vue'
import Vuex from 'vuex'

import Database from '../assets/Database.class'

Vue.use(Vuex)

let Db = new Database()

export const store = new Vuex.Store({
  getters: {
    accounts() {
      try {
        return Db.exec('SELECT * FROM accounts')
      }catch (e) {
        return []
      }
    }
  }
})

export function loadFromFile(file = null){
  Db = new Database(file)
}
