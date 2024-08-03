import { useState, useEffect, useCallback } from 'react'
import './App.css'
import AppState from './AppState'
import Welcome from '@renderer/welcome/Welcome'

export default function App(): JSX.Element {
  const [appState, setAppState] = useState(new AppState())
  const [updateData, setUpdateData] = useState<string | null | undefined>(undefined)
  const [load, setLoad] = useState<{ data: string; url: string; type: string } | undefined>(
    undefined
  )
  const [didSave, setDidSave] = useState<{ id: string; path: string; type: string } | undefined>(
    undefined
  )

  const [openSpec, setOpenSpec] = useState<{ id: string } | undefined>(undefined)
  const [currentGraph, setCurrentGraph] = useState<{ data: string } | undefined>(undefined)

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
  const didOpenSpec = useCallback((path: string): void => {
    window.ipc.didOpenSpec(path)
  }, [])
  const didCloseSpec = useCallback((path: string): void => {
    window.ipc.didCloseSpec(path)
  }, [])

  useEffect(() => {
    if (updateData === undefined) return
    setUpdateData(undefined)
    const result = appState.selectedData
    if (!result) return
    const [id, data, type] = result
    window.ipc.save(id, updateData, data, type)
  }, [updateData, setUpdateData, appState])
  useEffect(() => {
    if (load === undefined) return
    setLoad(undefined)
    if (load.type == 'machine') {
      setAppState(appState.loadRootMachine(load.data, load.url, setAppState))
    } else if (load.type == 'arrangement') {
      setAppState(appState.loadRootArrangement(load.data, load.url, setAppState))
    }
  }, [load, setLoad, appState, setAppState])
  useEffect(() => {
    if (didSave === undefined) return
    setDidSave(undefined)
    setAppState(appState.addID(didSave.id, didSave.path))
  }, [didSave, setDidSave, appState, setAppState])

  useEffect(() => {
    window.ipc.updateData((e, path) => {
      setUpdateData(path)
    })
  }, [setUpdateData])
  useEffect(() => {
    window.ipc.load((e, data, url, type) => {
      setLoad({ data: data, url: url, type: type })
    })
  }, [setLoad])
  useEffect(() => {
    console.log('useEffect', appState.selected)
    window.ipc.didSave((e, id, path, type) => {
      setDidSave({ id: id, path: path, type: type })
    })
  }, [setDidSave])
  useEffect(() => {
    window.ipc.openSpec((e, url) => {
      const id = appState.id(url)
      if (!id) return
      setOpenSpec({ id: id })
      didOpenSpec(url)
    })
  }, [appState, setOpenSpec, didOpenSpec])
  useEffect(() => {
    window.ipc.closeSpec((e, url) => {
      setOpenSpec(undefined)
      didCloseSpec(url)
    })
  }, [setOpenSpec])
  useEffect(() => {
    console.log('Getting graph!')
    window.ipc.didGenerateGraph((e, data) => {
      console.log('Got graph!')
      setCurrentGraph({ data: data })
    })
  }, [setCurrentGraph])
  if (currentGraph) {
    return <img src={`data:image/svg+xml;utf8,${encodeURIComponent(currentGraph.data)}`} />
  }
  if (openSpec) {
    return appState.specView(openSpec.id, setAppState)
  }
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
