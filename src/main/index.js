'use strict'

import { app, BrowserWindow, Notification, Menu, dialog, TouchBar, ipcMain } from 'electron'
import * as path from 'path'
import * as i18njs from 'i18njs'

const {
  TouchBarLabel,
  TouchBarButton,
  TouchBarSpacer,
  TouchBarPopover,
  TouchBarSlider,
  TouchBarSegmentedControl
} = TouchBar
const jsonfile = require('jsonfile')

let filePath = ''
let authorizeDev = true
let isDev = true

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const globSettings = jsonfile.readFileSync(`${__static}/settings.json`)
const pjson = require('../../package.json')
const lang = jsonfile.readFileSync(`${__static}/lang/${globSettings.language}_.json`)

i18njs.add(globSettings.language, '', lang)
i18njs.setLang(globSettings.language)

let mainWindow, splash
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const template = [{
  label: i18njs.get('.MAIN.MENU.FILE.DEFAULT'),
  submenu: [{
    label: i18njs.get('.MAIN.MENU.FILE.NEW_FILE'),
    accelerator: 'CmdOrCtrl+N',
    click () { newfile() }
  }, {
    label: i18njs.get('.MAIN.MENU.FILE.OPEN'),
    accelerator: 'CmdOrCtrl+O',
    click () { openfile(() => {}) }
  }, {
    label: i18njs.get('.MAIN.MENU.FILE.SAVE'),
    accelerator: 'CmdOrCtrl+S',
    click () {
      simpleSave()
    }
  }, {
    label: i18njs.get('.MAIN.MENU.FILE.SAVE_AS'),
    accelerator: 'CmdOrCtrl+Shift+S',
    click () { saveAs() }
  }, {
    type: 'separator'
  }, {
    label: i18njs.get('.MAIN.MENU.FILE.SETTINGS'),
    accelerator: 'CmdOrCtrl+,',
    click () {
      exports.openSettingWindow()
    }
  }, {
    type: 'separator'
  }, {
    role: 'quit'
  }]
}, {
  role: 'editMenu'
}, {
  label: i18njs.get('.MAIN.MENU.REPORTS.DEFAULT'),
  submenu: [{
    label: i18njs.get('.MAIN.MENU.REPORTS.TIME'),
    accelerator: 'Alt+T',
    icon: path.join(__static, '/assets/img/fa-area-chart_16.png'),
    click () {
      exports.openChronoWindow()
    }
  }, {
    label: i18njs.get('.MAIN.MENU.REPORTS.STATISTIC'),
    accelerator: 'Alt+S',
    icon: path.join(__static, '/assets/img/fa-pie-chart_16.png'),
    click () {
      exports.openStatisticWindow()
    }
  }, {
    label: i18njs.get('.MAIN.MENU.REPORTS.BALANCE'),
    accelerator: 'Alt+B',
    icon: path.join(__static, '/assets/img/fa-line-chart_16.png'),
    click () {
      exports.openBalanceWindow()
    }
  }]
}, {
  label: i18njs.get('.MAIN.MENU.WINDOWS.DEFAULT'),
  role: 'window',
  submenu: [{
    role: 'reload'
  }, {
    role: 'minimize'
  }, {
    role: 'togglefullscreen'
  }, {
    role: 'close'
  }]
}, {
  role: 'help',
  submenu: [
    {
      label: i18njs.get('.MAIN.MENU.HELP.LEARN'),
      click () { require('electron').shell.openExternal('https://electron.atom.io') }
    }]
}]

if (authorizeDev) {
  template.push({
    label: i18njs.get('.MAIN.MENU.ABOUT.DEFAULT'),
    submenu: [{
      label: i18njs.get('.MAIN.MENU.ABOUT.VERSION') + pjson.version,
      type: 'checkbox',
      checked: true,
      enabled: false
    }, {
      type: 'separator'
    }, {
      label: 'Enable DevTools',
      type: 'checkbox',
      checked: isDev,
      role: 'toggledevtools',
      click () {
        isDev = !isDev
      }
    }]
  })
}
if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {
        label: i18njs.get('.MAIN.MENU.ABOUT.DEFAULT'),
        role: 'about'
      },
      {type: 'separator'},
      {
        label: i18njs.get('.MAIN.MENU.FILE.SETTINGS'),
        accelerator: 'CmdOrCtrl+,',
        click () {
          exports.openSettingWindow()
        }
      },
      {type: 'separator'},
      {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  })
  template[1].submenu.pop()
  template[1].submenu.pop()
  template[1].submenu.pop()
}

const settingTBButton = new TouchBarButton({
  backgroundColor: '#3272dd',
  icon: path.join(__static, '/assets/img/fa-sliders_16.png'),
  click () {
    exports.openSettingWindow()
  }
})

const chronoTBButton = new TouchBarButton({
  backgroundColor: '#00d1b2',
  icon: path.join(__static, '/assets/img/fa-area-chart_16.png'),
  click () {
    exports.openChronoWindow()
  }
})

const statisticTBButton = new TouchBarButton({
  backgroundColor: '#ffdd57',
  icon: path.join(__static, '/assets/img/fa-pie-chart_16.png'),
  click () {
    exports.openStatisticWindow()
  }
})

const balanceTBButton = new TouchBarButton({
  backgroundColor: '#ff3860',
  icon: path.join(__static, '/assets/img/fa-line-chart_16.png'),
  click () {
    exports.openBalanceWindow()
  }
})

const openTBPopover = new TouchBarPopover({
  icon: path.join(__static, '/assets/img/fa-bars_16.png'),
  iconPosition: 'left',
  items: [
    settingTBButton,
    chronoTBButton,
    statisticTBButton,
    balanceTBButton
  ]
})

const tabTBButton = new TouchBarSegmentedControl({
  segments: [
    new TouchBarLabel({label: i18njs.get('.MAIN.TOUCHBAR.TABS.DASHBOARD')}),
    new TouchBarLabel({label: i18njs.get('.MAIN.TOUCHBAR.TABS.ACCOUNTS')}),
    new TouchBarLabel({label: i18njs.get('.MAIN.TOUCHBAR.TABS.RECURRINGS')})
  ],
  change (selectedIndex) {
    mainWindow.webContents.send('toggle', selectedIndex)
  }
})

function createWindow () {
  // Initial window options
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1270,
    icon: path.join(__static, '/icons/png/Round/64x64.png'),
    backgroundColor: '#282c34',
    titleBarStyle: 'hidden',
    show: false
  })

  splash = new BrowserWindow({
    width: 350,
    height: 400,
    transparent: true,
    backgroundColor: '#282c34',
    frame: false,
    alwaysOnTop: false
  })

  const splashURL = process.env.NODE_ENV === 'development'
    ? `file://${__static}/html/splash.html`
    : `file://${__static}/html/splash.html`
  splash.loadURL(splashURL)

  mainWindow.loadURL(winURL)

  const mainTBar = new TouchBar([
    openTBPopover,
    new TouchBarSpacer({size: 'flexible'}),
    tabTBButton,
    new TouchBarSpacer({size: 'flexible'})
  ])
  mainWindow.setTouchBar(mainTBar)

  ipcMain.on('tab-update', (event, args) => {
    mainTBar.items['9'].selectedIndex = args
  })

  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      mainWindow.show()
      splash.destroy()
    }, 2500)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  app.setVersion(pjson.version)
  createWindow()
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('before-quit', (event) => {
  if (global.preventClose) {
    event.preventDefault()
  }
})

ipcMain.on('open-file', (event) => {
  openfile((file) => {
    event.returnValue = file
  })
})

ipcMain.on('file-to-save', (event, args) => {
  filePath = args
})

ipcMain.on('new-Settings', (event, args) => {
  mainWindow.webContents.send('new-Settings', args)
})

ipcMain.on('save', (event, arg) => {
  simpleSave()
  if (arg) {
    setTimeout(app.quit, 100)
  }
  event.returnValue = true
})

ipcMain.on('quit', (event) => {
  app.quit()
})

ipcMain.on('warning', (event, args) => {
  dialog.showMessageBox(mainWindow, args, function (index) {
    event.returnValue = index
  })
})

ipcMain.on('open-report', (event, args) => {
  if (globSettings.displayHelpers || globSettings.displayHelpers === 'undefined') {
    let displayWindow = null
    switch (args) {
      case 'balanceWin':
        displayWindow = balanceWin
        break
      case 'chronoWin':
        displayWindow = chronoWin
        break
      case 'statisticWin':
        displayWindow = statisticWin
        break
      default:
        displayWindow = mainWindow
    }
    const options = {
      type: 'info',
      title: ('Before you continue ...'),
      message: (`You should save before opening report`),
      detail: (`The info displayed are the most accurate only if all data are saved`),
      checkboxLabel: (`Don't show this again`)
    }
    dialog.showMessageBox(displayWindow, options, function (response, checkboxChecked) {
      if (checkboxChecked) {
        globSettings.displayHelpers = false
        jsonfile.writeFile(`${__static}/settings.json`, globSettings, {
          spaces: 2
        }, function (err) {
          if (err != null) {
            console.error(err)
          }
        })
      }
    })
  }
})

ipcMain.on('notification', (event, args) => {
  new Notification(args).show()
})

ipcMain.on('set-prevent-close', (event, args) => {
  global.preventClose = args
})

function newfile () {
  filePath = ''
  mainWindow.webContents.send('open-new-file')
}

function openfile (callback) {
  dialog.showOpenDialog(mainWindow, {
    filters: [{name: 'Mercury Files', extensions: ['mcy']}],
    properties: ['openFile'],
    message: ('Choose your Mercury file')
  }, function (files) {
    if (files) {
      mainWindow.webContents.send('selected-file', files[0])
      filePath = files[0]
      callback(files[0])
    }
  })
}

function simpleSave () {
  if (filePath === '') {
    saveAs()
  } else {
    console.log('Saving in ' + filePath)
    mainWindow.webContents.send('saved-file', filePath)
  }
}

function saveAs () {
  const options = {
    title: ('Save your data'),
    filters: [
      { name: 'Mercury Files', extensions: ['mcy'] }
    ]
  }
  dialog.showSaveDialog(mainWindow, options, function (filename) {
    mainWindow.webContents.send('saved-file', filename)
    filePath = filename
  })
}
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
