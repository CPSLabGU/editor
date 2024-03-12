import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  IpcMainEvent,
  Menu,
  dialog,
  ipcRenderer
} from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
let number = 0

let currentPath: string | undefined = undefined
let currentData: object | undefined = undefined

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  let fileMenus = [
    {
      label: 'Open',
      click: () => {
        const filePath: string[] | undefined = dialog.showOpenDialogSync(mainWindow, {
          properties: ['openFile'],
          filters: [
            { name: 'Machines', extensions: ['machine'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        })
        if (!filePath || filePath.length < 1) {
          console.log('Malformed file path detected.')
          return
        }
        const fd = fs.openSync(filePath[0], 'r')
        if (fd < 0) {
          console.log('Failed to open file at path: ' + filePath[0])
          return
        }
        const data = fs.readFileSync(fd, 'utf-8')
        fs.closeSync(fd)
        currentPath = filePath[0]
        mainWindow.webContents.send('load', data)
      }
    }
  ]
  if (currentPath) {
    fileMenus.push({
      label: 'Save',
      click: () => {
        mainWindow.webContents.send('updateData')
        if (currentData) {
          saveMachine(currentData!, currentPath!)
        } else {
          console.log("Cannot find model in save function.")
        }
      }
    })
  }
  fileMenus.push({
    label: 'Save As',
    click: () => {
      mainWindow.webContents.send('updateData')
      if (currentData) {
        const filePath: string | undefined = dialog.showSaveDialogSync(mainWindow, {
          properties: ['createDirectory'],
          filters: [
            { name: 'Machines', extensions: ['machine'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        })
        if (filePath) {
          saveMachine(currentData, filePath!)
        }
      } else {
        console.log('Cannot find model in Save-As function.')
      }
    }
  })
  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: fileMenus
    }
  ])

  Menu.setApplicationMenu(menu)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  ipcMain.on('print', (event: IpcMainEvent, message: string) => {
    console.log(message)
  })
  ipcMain.on('setCurrentData', (event: IpcMainEvent, data: object) => {
    currentData = data
  })
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  ipcMain.handle('testEvent', incrementNumber)

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function incrementNumber(): number {
  return ++number
}

// Data is the machine model, path is the file path to the machine folder.
function saveMachine(data: object, path: string): void {
  fs.writeFileSync(path + '/model.json', JSON.stringify(data))
}

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
