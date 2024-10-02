import path from 'path'
import { app, BrowserWindow, dialog, ipcMain, IpcMainEvent, Menu } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { exec } from 'child_process'
import fs from 'fs/promises';
import { randomUUID } from 'crypto'

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
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  const mainId = mainWindow.webContents.id;
  const splashWindow = createWindow('splash', {
    width: 600,
    height: 400,
    alwaysOnTop: true,
    frame: false,
    resizable: false,
    hasShadow: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  splashWindow.center();
  let splashOpen = true;
  const splashId = splashWindow.webContents.id;

  const mainMessageListener = async (event: IpcMainEvent, args) => {
    if (event.sender.id != mainId) return;
    event.reply('message', `${args} World!`)
  }
  const mainOpenArrangementLisener = (event: IpcMainEvent) => {
    if (event.sender.id != mainId) return;
    openFileDialog(mainWindow, 'arrangement')
  }
  const mainOpenMachineListener = (event: IpcMainEvent) => {
    if (event.sender.id != mainId) return;
    openFileDialog(mainWindow, 'machine')
  }
  const mainDidLoad = (event: IpcMainEvent) => {
    if (event.sender.id != mainId) return;
    if (splashOpen) {
      splashWindow.close();
      mainWindow.show();
    }
  }
  const mainSaveSpecAndVerify = async (event: IpcMainEvent, path: string, spec: string) => {
    if (event.sender.id != mainId) return;
    await fs.writeFile(path + '/spec.tctl', spec);
    await generateKripkeStructure(path, mainWindow);
  }
  const mainSaveListener = async (
    event: IpcMainEvent,
    id: string,
    path: string | null,
    data: string,
    type: string,
    spec: string,
  ): Promise<void> => {
    if (event.sender.id != mainId) return;
    await saveEntity(mainWindow, id, path, data, type, spec);
  }
  ipcMain.addListener('message', mainMessageListener);
  ipcMain.addListener('openArrangement', mainOpenArrangementLisener);
  ipcMain.addListener('openMachine', mainOpenMachineListener);
  ipcMain.addListener('save', mainSaveListener);
  ipcMain.addListener('didLoad', mainDidLoad);
  ipcMain.addListener('saveSpecAndVerify', mainSaveSpecAndVerify);
  mainWindow.on('closed', () => {
    ipcMain.removeListener('message', mainMessageListener);
    ipcMain.removeListener('openArrangement', mainOpenArrangementLisener);
    ipcMain.removeListener('openMachine', mainOpenMachineListener);
    ipcMain.removeListener('save', mainSaveListener);
    ipcMain.removeListener('didLoad', mainDidLoad);
    ipcMain.removeListener('saveSpecAndVerify', mainSaveSpecAndVerify);
  })
  const splashOpenArrangementLisener = (event: IpcMainEvent) => {
    if (event.sender.id != splashId) return;
    openFileDialog(mainWindow, 'arrangement')
  }
  const splashOpenMachineListener = (event: IpcMainEvent) => {
    if (event.sender.id != splashId) return;
    openFileDialog(mainWindow, 'machine')
  }
  ipcMain.addListener('openArrangement', splashOpenArrangementLisener);
  ipcMain.addListener('openMachine', splashOpenMachineListener);
  splashWindow.on('closed', () => {
    splashOpen = false;
    ipcMain.removeListener('openArrangement', splashOpenArrangementLisener);
    ipcMain.removeListener('openMachine', splashOpenMachineListener);
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
    await splashWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    await splashWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
    splashWindow.webContents.openDevTools()
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
  type: string,
  spec: string,
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
  if (type === 'machine') {
    await fs.writeFile(filePath + '/spec.tctl', spec)
  }
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
  let spec: string | undefined;
  if (newType === 'machine') {
    try {
      spec = await fs.readFile(filePath[0] + '/spec.tctl', 'utf-8');
    } catch {}
  }
  window.webContents.send('load', data, filePath[0], newType, spec)
  generateFileMenus(window, filePath[0], newType)
}

async function asyncExec(command: string, window: BrowserWindow): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    window.webContents.send('consoleMessage', randomUUID(), new Date().toISOString(), 'stdin', command);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        window.webContents.send('consoleMessage', randomUUID(), new Date().toISOString(), 'stderr', `${error}`);
        reject(error);
        return;
      }
      if (stdout !== '') {
        window.webContents.send('consoleMessage', randomUUID(), new Date().toISOString(), 'stdout', stdout);
      }
      if (stderr !== '') {
        window.webContents.send('consoleMessage', randomUUID(), new Date().toISOString(), 'stderr', stderr);
      }
      resolve(stdout);
    })
  });
}

async function generateKripkeStructure(machinePath: string, window: BrowserWindow): Promise<string> {
  await asyncExec(`llfsm-verify --machine ${machinePath} ${machinePath}/spec.tctl --write-graphviz`, window);
  return await asyncExec(`dot -Tsvg ${machinePath}/build/verification/graph.dot`, window);
}

function generateFileMenus(window: BrowserWindow, path: string | null, type: string): void {
  const menus = [];
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
  if (type === 'machine' && path !== null) {
    fileMenus.push({
      label: 'Export to Machine',
      click: async (): Promise<void> => {
        asyncExec('llfsmgenerate model ' + path, window);
      },
    });
  }
  menus.push({
    label: 'File',
    submenu: fileMenus,
  });
  if (type === 'machine' && path !== null) {
    const runMenus = [{
      label: 'Generate VHDL',
      click: async (): Promise<void> => {
        asyncExec('llfsmgenerate vhdl ' + path, window)
      }
    }];
    runMenus.push({
      label: 'Create Kripke Structure Generator',
      click: async (): Promise<void> => {
        asyncExec('llfsmgenerate vhdl --include-kripke-structure ' + path, window)
      }
    })
    runMenus.push({
      label: 'Verify',
      click: async (): Promise<void> => {
        const svg = await generateKripkeStructure(path, window);
        window.webContents.send('didGenerateKripkeStructure', path, type, svg);
      }
    })
    menus.push({
      label: 'Run',
      submenu: runMenus,
    });
  }
  const menu = Menu.buildFromTemplate(menus);
  Menu.setApplicationMenu(menu)
  return
}
