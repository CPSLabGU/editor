import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value)
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
  openArrangement() {
    ipcRenderer.send('openArrangement');
  },
  openMachine() {
    ipcRenderer.send('openMachine');
  },
  load(callback: (e: IpcRendererEvent, data: string, url: string, type: string, spec?: string) => void) {
    ipcRenderer.on('load', callback)
  },
  didLoad() {
    ipcRenderer.send('didLoad');
  },
  consoleMessage(callback: (e: IpcRendererEvent, id: string, timestamp: string, type: 'stdin' | 'stdout' | 'stderr', message: string) => void) {
    ipcRenderer.on('consoleMessage', callback);
  },
  didGenerateKripkeStructure(callback: (e: IpcRendererEvent, path: string, type: string, svg: string) => void) {
    ipcRenderer.on('didGenerateKripkeStructure', callback);
  },
  updateData(callback: (e: IpcRendererEvent, path: string | null, type: string) => void) {
    ipcRenderer.on('updateData', callback)
  },
  save(id: string, path: string | null, data: string, type: string) {
    ipcRenderer.send('save', id, path, data, type)
  },
  didSave(callback: (e: IpcRendererEvent, id: string, path: string, type: string) => void) {
    ipcRenderer.on('didSave', callback)
  }
}

contextBridge.exposeInMainWorld('ipc', handler)

export type IpcHandler = typeof handler
