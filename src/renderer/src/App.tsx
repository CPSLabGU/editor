// @ts-nocheck

import { useState, useEffect } from 'react'
import './App.css'
import AppState from './AppState'

export default function App(): JSX.Element {
  const [appState, setAppState] = useState(new AppState())

  // useEffect(() => {
  //   setAppState(appState.newRootArrangement('vhdl'))
  // }, [])

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
    return <div></div>
  } else {
    return appState.canvasSwitcher(setAppState)
  }
}
