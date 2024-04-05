import { app, shell, BrowserWindow, ipcMain, IpcMainEvent, Menu, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
const { exec } = require('node:child_process')
// let number = 0

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

  generateFileMenus(mainWindow, null, '')

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

  ipcMain.on('openArrangement', () => {
    openFileDialog(mainWindow)
  })

  ipcMain.on('openMachine', () => {
    openFileDialog(mainWindow)
  })

  ipcMain.on('save', (event: IpcMainEvent, path: string | null, data: string, type: string) => {
    if (path) {
      fs.writeFileSync(path + '/model.json', data)
      return
    }
    const filters: Electron.FileFilter[] = []
    if (type == 'arrangement') {
      filters.push({ name: 'Arrangement', extensions: ['arrangement'] })
    } else if (type == 'machine') {
      filters.push({ name: 'Machines', extensions: ['machine'] })
    }
    filters.push({ name: 'All Files', extensions: ['*'] })
    const filePath: string | undefined = dialog.showSaveDialogSync(mainWindow, {
      properties: ['createDirectory'],
      filters: filters
    })
    if (filePath) {
      if (!filePath.endsWith(`.${type}`)) {
        console.error('Incorrect file extension.')
        return
      }
      fs.mkdir(filePath, { recursive: true }, () => {
        console.error(`Couldn't create ${type} folder`)
      })
      fs.writeFile(filePath + '/model.json', data, () => {
        generateFileMenus(mainWindow, filePath, type)
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

function openFileDialog(window: BrowserWindow): void {
  const filePath: string[] | undefined = dialog.showOpenDialogSync(window, {
    properties: ['openDirectory', 'openFile'],
    filters: [
      { name: 'Machines', extensions: ['machine'] },
      { name: 'Arrangements', extensions: ['arrangement'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })
  if (!filePath || filePath.length < 1) {
    console.error('Malformed file path detected.')
    return
  }
  let newType: string = ''
  if (filePath[0].endsWith('.arrangement')) {
    newType = 'arrangement'
  } else if (filePath[0].endsWith('.machine')) {
    newType = 'machine'
  }
  const fd = fs.openSync(filePath[0] + '/model.json', 'r')
  if (fd < 0) {
    console.error('Failed to open file at path: ' + filePath[0])
    return
  }
  const data = fs.readFileSync(fd, 'utf-8')
  fs.closeSync(fd)
  window.webContents.send('load', data, filePath[0], newType)
  generateFileMenus(window, filePath[0], newType)
}

function generateFileMenus(mainWindow: BrowserWindow, path: string | null, type: string): void {
  const fileMenus = [
    {
      label: 'Open',
      click: (): void => openFileDialog(mainWindow)
    }
  ]
  if (path) {
    fileMenus.push({
      label: 'Save',
      click: () => {
        mainWindow.webContents.send('updateData', path, type)
      }
    })
  }
  fileMenus.push({
    label: 'Save As',
    click: () => {
      mainWindow.webContents.send('updateData', null, type)
    }
  })
  if (path && type == 'machine') {
    fileMenus.push({
      label: 'Export to Machine',
      click: () => {
        exec('llfsmgenerate model ' + path, (error, stdout, stderr) => {
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
        exec('llfsmgenerate vhdl ' + path, (error, stdout, stderr) => {
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
        exec('llfsmgenerate vhdl --include-kripke-structure ' + path, (error, stdout, stderr) => {
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
