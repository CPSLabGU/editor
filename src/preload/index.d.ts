import { ElectronAPI } from '@electron-toolkit/preload'
import { IpcRendererEvent } from 'electron'

interface IPCInterface {
  load: (callback: (e: IpcRendererEvent, data: string, url: string, type: string) => void) => void
  open: (callback: (e: IpcRendererEvent) => void) => void
  openArrangement: () => void
  openMachine: () => void
  save: (id: string, path: string | null, data: string, type: string) => void
  updateData: (callback: (e: IpcRendererEvent, path: string | null, type: string) => void) => void
  didSave: (callback: (e: IpcRendererEvent, id: string, path: string, type: string) => void) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    ipc: IPCInterface
  }
}
