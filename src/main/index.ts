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
const { exec } = require('node:child_process')
// let number = 0

let currentPath: string | undefined = undefined

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

  generateFileMenus(mainWindow)

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
  // ipcMain.on('print', (event: IpcMainEvent, message: string) => {
  //   console.log(message)
  // })
  ipcMain.on('save', (event: IpcMainEvent, data: string, saveAs: boolean) => {
    if (!saveAs) {
      fs.writeFileSync(currentPath! + '/model.json', data)
      return
    }
    const filePath: string | undefined = dialog.showSaveDialogSync(mainWindow, {
      properties: ['createDirectory'],
      filters: [
        { name: 'Machines', extensions: ['machine'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })
    if (filePath) {
      if (!filePath.endsWith('.machine')) {
        console.log('Incorrect file extension.')
        return
      }
      fs.mkdir(filePath, { recursive: true }, (err) => {
        console.log("Couldn't create machine folder")
      })
      fs.writeFile(filePath! + '/model.json', data, () => {
        currentPath = filePath
        generateFileMenus(mainWindow)
        console.log('Finished writing model.')
    })
    }
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
  // ipcMain.handle('testEvent', incrementNumber)

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

// function incrementNumber(): number {
//   return ++number
// }

function generateFileMenus(mainWindow: BrowserWindow): void {
  const fileMenus = [
    {
      label: 'Open',
      click: () => {
        const filePath: string[] | undefined = dialog.showOpenDialogSync(mainWindow, {
          properties: ['openDirectory', 'openFile'],
          filters: [
            { name: 'Machines', extensions: ['machine'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        })
        if (!filePath || filePath.length < 1) {
          console.log('Malformed file path detected.')
          return
        }
        const fd = fs.openSync(filePath[0] + '/model.json', 'r')
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
        mainWindow.webContents.send('updateData', false)
      }
    })
  }
  fileMenus.push({
    label: 'Save As',
    click: () => {
      mainWindow.webContents.send('updateData', true)
    }
  })
  if (currentPath) {
    fileMenus.push({
      label: 'Export to Machine',
      click: () => {
        exec('llfsmgenerate model ' + currentPath!, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`)
            return
          }
          console.log(`stdout: ${stdout}`)
          console.error(`stderr: ${stderr}`)
        })
      }
    })
    fileMenus.push({
      label: 'Generate VHDL',
      click: () => {
        exec('llfsmgenerate vhdl ' + currentPath!, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`)
            return
          }
          console.log(`stdout: ${stdout}`)
          console.error(`stderr: ${stderr}`)
        })
      }
    })
    fileMenus.push({
      label: 'Create Kripke Structure Generator',
      click: () => {
        exec(
          'llfsmgenerate vhdl --include-kripke-structure ' + currentPath!,
          (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`)
              return
            }
            console.log(`stdout: ${stdout}`)
            console.error(`stderr: ${stderr}`)
        })
      }
    })
  }
  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: fileMenus
    }
  ])
  Menu.setApplicationMenu(menu)
  return
}

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
