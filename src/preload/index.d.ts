import { ElectronAPI } from '@electron-toolkit/preload'

interface IPCInterface {
  test: () => number
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    ipc: IPCInterface
  }
}
