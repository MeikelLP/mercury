import {ipcRenderer} from 'electron'
import {saveDatabase, openDatabase, store} from './store'

ipcRenderer.on('saved-file', (event, arg) => {
  saveDatabase(arg)
})
ipcRenderer.on('open-new-file', () => {
  openDatabase()
})
ipcRenderer.on('selected-file', (event, arg) => {
  openDatabase(arg)
})
ipcRenderer.on('new-Settings', (event, arg) => {
  store.state.settings = arg // TODO why?
})
