import path from 'path'
import { app, BrowserWindow, dialog, ipcMain, IpcMainEvent, Menu } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { exec } from 'child_process'
import fs from 'fs/promises';

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

async function createMainWindow(): Promise<void> {
  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  const webContentsId = mainWindow.webContents.id;

  const messageListener = async (event: IpcMainEvent, args) => {
    if (event.sender.id != webContentsId) return;
    event.reply('message', `${args} World!`)
  }
  const openArrangementLisener = (event: IpcMainEvent) => {
    if (event.sender.id != webContentsId) return;
    openFileDialog(mainWindow, 'arrangement')
  }
  const openMachineListener = (event: IpcMainEvent) => {
    if (event.sender.id != webContentsId) return;
    openFileDialog(mainWindow, 'machine')
  }
  const saveListener = async (
    event: IpcMainEvent,
    id: string,
    path: string | null,
    data: string,
    type: string
  ): Promise<void> => {
    if (event.sender.id != webContentsId) return;
    await saveEntity(mainWindow, id, path, data, type);
  }
  ipcMain.addListener('message', messageListener);
  ipcMain.addListener('openArrangement', openArrangementLisener);
  ipcMain.addListener('openMachine', openMachineListener);
  ipcMain.addListener('save', saveListener);
  mainWindow.on('closed', () => {
    ipcMain.removeListener('message', messageListener);
    ipcMain.removeListener('openArrangement', openArrangementLisener);
    ipcMain.removeListener('openMachine', openMachineListener);
    ipcMain.removeListener('save', saveListener);
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
}

;(async () => {
  await app.whenReady()
  await createMainWindow();
})()

app.on('window-all-closed', () => {
  app.quit()
})

async function saveEntity(
  window: BrowserWindow,
  id: string,
  path: string | null,
  data: string,
  type: string
) {
  if (path) {
    await fs.writeFile(path + '/model.json', data)
    window.webContents.send('didSave', id, path, type)
    return
  }
  const filters: Electron.FileFilter[] = []
  if (type == 'arrangement') {
    filters.push({ name: 'Arrangement', extensions: ['arrangement'] })
  } else if (type == 'machine') {
    filters.push({ name: 'Machines', extensions: ['machine'] })
  }
  filters.push({ name: 'All Files', extensions: ['*'] })
  const filePath: string | undefined = dialog.showSaveDialogSync(window, {
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
  generateFileMenus(window, filePath, type)
  window.webContents.send('didSave', id, filePath, type)
}

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

function generateFileMenus(window: BrowserWindow, path: string | null, type: string): void {
  const fileMenus = [
    {
      label: 'Open',
      click: async (): Promise<void> => await openFileDialog(window, '')
    }
  ]
  if (path) {
    fileMenus.push({
      label: 'Save',
      click: async (): Promise<void> => {
        window.webContents.send('updateData', path, type)
      }
    })
  }
  fileMenus.push({
    label: 'Save As',
    click: async (): Promise<void> => {
      window.webContents.send('updateData', null, type)
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
