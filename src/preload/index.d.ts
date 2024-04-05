import { ElectronAPI } from '@electron-toolkit/preload'
import { IpcRendererEvent } from 'electron'

interface IPCInterface {
  test: () => Promise<number>
  print: (message: string) => void
  open: (callback: (e: IpcRendererEvent) => void) => void
  openArrangement: () => void
  openMachine: () => void
  load: (callback: (e: IpcRendererEvent, data: string, url: string, type: string) => void) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    ipc: IPCInterface
  }
}
