// @ts-nocheck

import { useState, useEffect, useCallback } from 'react'
import './App.css'
import AppState from './AppState'
import Welcome from '@renderer/welcome/Welcome'

export default function App(): JSX.Element {
  const [appState, setAppState] = useState(new AppState())

  const openArrangement = useCallback((): void => {
    window.ipc.openArrangement()
  }, [])
  const openMachine = useCallback((): void => {
    window.ipc.openMachine()
  }, [])
  const createArrangement = useCallback((): void => {
    setAppState(appState.newRootArrangement('vhdl', setAppState))
  }, [appState, setAppState])
  const createMachine = useCallback((): void => {
    setAppState(appState.newRootMachine(setAppState))
  }, [appState, setAppState])

  useEffect(() => {
    window.ipc.load((e, data, url, type) => {
      if (type == 'machine') {
        setAppState(appState.loadRootMachine(data, url, setAppState))
      } else if (type == 'arrangement') {
        setAppState(appState.loadRootArrangement(data, url, setAppState))
      }
    })
    window.ipc.updateData((e, path) => {
      const result = appState.selectedData
      if (!result) return
      const [data, type] = result
      window.ipc.save(path, data, type)
    })
  }, [appState, setAppState])
  if (!appState.root) {
    return (
      <Welcome
        openArrangement={openArrangement}
        openMachine={openMachine}
        createArrangement={createArrangement}
        createMachine={createMachine}
      />
    )
  } else {
    return appState.canvasSwitcher(setAppState)
  }
}
