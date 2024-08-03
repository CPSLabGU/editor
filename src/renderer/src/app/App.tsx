import { useState, useEffect, useCallback } from 'react'
import './App.css'
import AppState from './AppState'
import Welcome from '@renderer/welcome/Welcome'
import TabbedView from '@renderer/tabbed_view/TabbedView'

export default function App(): JSX.Element {
  const [appState, setAppState] = useState(new AppState())
  const [updateData, setUpdateData] = useState<string | null | undefined>(undefined)
  const [load, setLoad] = useState<{ data: string; url: string; type: string } | undefined>(
    undefined
  )
  const [didSave, setDidSave] = useState<{ id: string; path: string; type: string } | undefined>(
    undefined
  )
  const [focusedView, setFocusedView] = useState<{ id: string; viewType: string } | undefined>(
    undefined
  )

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
    let newState: AppState = appState
    if (load.type == 'machine') {
      newState = appState.loadRootMachine(load.data, load.url, setAppState)
    } else if (load.type == 'arrangement') {
      newState = appState.loadRootArrangement(load.data, load.url, setAppState)
    }
    const id = newState.id(load.url)
    if (!id) return
    const type = load.type ?? 'welcome'
    const view = newState.createView(id, type, undefined, setAppState) ?? (
      <Welcome
        openArrangement={openArrangement}
        openMachine={openMachine}
        createArrangement={createArrangement}
        createMachine={createMachine}
      />
    )
    setAppState(newState.setView(id, type, view))
    setFocusedView({ id: id, viewType: type })
  }, [
    load,
    setLoad,
    appState,
    setAppState,
    openArrangement,
    openMachine,
    createArrangement,
    createMachine,
    setFocusedView
  ])
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
    window.ipc.openView((e, path, viewType, data) => {
      const id = appState.id(path)
      if (!id) return
      if (focusedView) {
        if (focusedView.id == id && focusedView?.viewType == viewType) return
      }
      const newView = appState.createView(id, viewType, data, setAppState)
      if (!newView) return
      setFocusedView({ id: id, viewType: viewType })
      setAppState(appState.setView(id, viewType, newView))
    })
  }, [focusedView, appState, setFocusedView, setAppState])
  console.log('Number of views: ', appState.numberOfOpenViews())
  if (appState.numberOfOpenViews() == 1) {
    const id = Object.keys(appState.views)[0]
    const viewType = Object.keys(appState.views[id])[0]
    const view = appState.views[id][viewType]
    if (!view) {
      return (
        <Welcome
          openArrangement={openArrangement}
          openMachine={openMachine}
          createArrangement={createArrangement}
          createMachine={createMachine}
        />
      )
    }
    console.log(`Have view with id ${id} and viewType ${viewType}: ${view}`)
    return view
  } else if (appState.numberOfOpenViews() == 0) {
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
  } else {
    console.log('Multiple views open!')
    return (
      <TabbedView views={appState.views} focusedView={focusedView} setViews={appState.setViews} />
    )
  }
}
