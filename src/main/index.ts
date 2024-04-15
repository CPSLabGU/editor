import { app, shell, BrowserWindow, ipcMain, IpcMainEvent, Menu, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs/promises'
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
    openFileDialog(mainWindow, 'arrangement')
  })

  ipcMain.on('openMachine', () => {
    openFileDialog(mainWindow, 'machine')
  })

  ipcMain.on(
    'save',
    async (
      event: IpcMainEvent,
      id: string,
      path: string | null,
      data: string,
      type: string
    ): Promise<void> => {
      if (path) {
        await fs.writeFile(path + '/model.json', data)
        mainWindow.webContents.send('didSave', id, path, type)
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
      if (!filePath) return
      if (!filePath.endsWith(`.${type}`)) {
        console.error('Incorrect file extension.')
        return
      }
      await fs.mkdir(filePath, { recursive: true })
      await fs.writeFile(filePath + '/model.json', data)
      generateFileMenus(mainWindow, filePath, type)
      mainWindow.webContents.send('didSave', id, filePath, type)
    }
  )
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

async function openFileDialog(window: BrowserWindow, type: string): Promise<void> {
  const filters: Electron.FileFilter[] = []
  if (type === 'machine') {
    filters.push({ name: 'Machines', extensions: ['machine'] })
  } else if (type == 'arrangement') {
    filters.push({ name: 'Arrangements', extensions: ['arrangement'] })
  }
  filters.push({ name: 'All Files', extensions: ['*'] })
  const filePath: string[] | undefined = dialog.showOpenDialogSync(window, {
    properties: ['openDirectory', 'openFile'],
    filters: filters
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
  const data = await fs.readFile(filePath[0] + '/model.json', 'utf-8')
  window.webContents.send('load', data, filePath[0], newType)
  generateFileMenus(window, filePath[0], newType)
}

function generateFileMenus(mainWindow: BrowserWindow, path: string | null, type: string): void {
  const fileMenus = [
    {
      label: 'Open',
      click: async (): Promise<void> => await openFileDialog(mainWindow, '')
    }
  ]
  if (path) {
    fileMenus.push({
      label: 'Save',
      click: async (): Promise<void> => {
        mainWindow.webContents.send('updateData', path, type)
      }
    })
  }
  fileMenus.push({
    label: 'Save As',
    click: async (): Promise<void> => {
      mainWindow.webContents.send('updateData', null, type)
    }
  })
  if (path && type == 'machine') {
    fileMenus.push({
      label: 'Export to Machine',
      click: async (): Promise<void> => {
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
      click: async (): Promise<void> => {
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
      click: async (): Promise<void> => {
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
