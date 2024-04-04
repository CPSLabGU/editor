// @ts-nocheck

import { useState, useEffect } from 'react'
import './App.css'
import AppState from './AppState'

export default function App(): JSX.Element {
  const [appState, setAppState] = useState(new AppState())

  useEffect(() => {
    window.ipc.load((e, data, url) => {
      setAppState(appState.loadRootMachine(data, url, setAppState))
    })
    window.ipc.updateData((e, saveAs) => {
      const data = appState.selectedMachineData
      if (!data) return
      window.ipc.save(data, saveAs)
    })
  }, [appState, setAppState])
  if (!appState.root) {
    return <div></div>
  } else {
    return appState.canvasSwitcher(setAppState)
  }
}
