import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

let number = 0

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('ipc', {
      test: () => ipcRenderer.invoke('testEvent'),
      print: (message: string) => ipcRenderer.send('print', message),
      open: (callback: (e: IpcRendererEvent) => void) => ipcRenderer.on('open', callback),
      load: (callback: (e: IpcRendererEvent, data: string) => void) =>
        ipcRenderer.on('load', callback),
      updateData: (callback: (e: IpcRendererEvent) => void) =>
        ipcRenderer.on('updateData', callback),
      setCurrentData: (data: string) => {
        console.log('Got data in preload: ', data)
        ipcRenderer.send('setCurrentData', data)
    }
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
