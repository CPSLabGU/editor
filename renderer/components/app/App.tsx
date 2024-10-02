import { useState, useEffect, useCallback } from 'react'
import AppState from './AppState'
import Welcome from '../welcome/Welcome'
import { useTheme } from 'next-themes'
import CanvasSwitcher from '../canvas_switcher/CanvasSwitcher'
import { useTriggerVerification } from '@/hooks/useTriggerVerification'

export default function App(): JSX.Element {
  const [appState, setAppState] = useState(new AppState())
  const [updateData, setUpdateData] = useState<string | null | undefined>(undefined)
  const [load, setLoad] = useState<{ data: string; url: string; type: string, spec?: string } | undefined>(
    undefined
  )
  const [didSave, setDidSave] = useState<{ id: string; path: string; type: string } | undefined>(
    undefined
  )
  const { verification, reset } = useTriggerVerification();
  const { resolvedTheme, theme } = useTheme();
  const openArrangement = useCallback((): void => {
    window.ipc.openArrangement()
  }, [])
  const openMachine = useCallback((): void => {
    window.ipc.openMachine()
  }, [])
  const createArrangement = useCallback((): void => {
    setAppState(appState.newRootArrangement('vhdl'))
  }, [appState, setAppState])
  const createMachine = useCallback((): void => {
    setAppState(appState.newRootMachine())
  }, [appState, setAppState])

  useEffect(() => {
    if (verification === undefined || verification.type !== 'machine') {
      reset();
      return;
    }
    const url = appState.url(verification.id);
    if (url === undefined) {
      reset();
      return;
    }
    window.ipc.saveSpecAndVerify(url, verification.type, verification.spec);
    reset();
  }, [verification]);

  useEffect(() => {
    if (updateData === undefined) return
    setUpdateData(undefined)
    const result = appState.selectedData
    if (!result) return
    const [id, data, type, spec] = result
    window.ipc.save(id, updateData, data, type, spec)
  }, [updateData, setUpdateData, appState])
  useEffect(() => {
    if ((resolvedTheme ?? theme) == appState.theme) return;
    if ((resolvedTheme ?? theme) == 'system') return;
    setAppState(appState.setTheme((resolvedTheme ?? theme) as 'dark' | 'light'));
  }, [resolvedTheme, theme, setAppState, appState]);
  useEffect(() => {
    if (load === undefined) return
    setLoad(undefined)
    if (load.type == 'machine') {
      setAppState(appState.loadRootMachine(load.data, load.url, load.spec))
    } else if (load.type == 'arrangement') {
      setAppState(appState.loadRootArrangement(load.data, load.url))
    }
    window.ipc.didLoad();
  }, [load, setLoad, appState, setAppState])
  useEffect(() => {
    window.ipc.didGenerateKripkeStructure((e, path, type, svg) => {
    console.log("Got svg: ", svg)
    setAppState(appState.setKripkeStructure(path, type, svg))
   })
  }, [appState, setAppState])
  useEffect(() => {
    if (didSave === undefined) return
    setDidSave(undefined)
    setAppState(appState.addID(didSave.id, didSave.path))
  }, [didSave, setDidSave, appState, setAppState])
  useEffect(() => {
    window.ipc.consoleMessage((e, id, timestamp, type, message) => {
      setAppState(appState.addConsoleMessage({ id, timestamp, type, message }).setConsoleVisible(true));
    });
  }, [appState, setAppState]);

  useEffect(() => {
    window.ipc.updateData((e, path) => {
      setUpdateData(path)
    })
  }, [setUpdateData])
  useEffect(() => {
    window.ipc.load((e, data, url, type, spec) => {
      setLoad({ data: data, url: url, type: type, spec: spec })
    })
  }, [setLoad])
  useEffect(() => {
    window.ipc.didSave((e, id, path, type) => {
      setDidSave({ id: id, path: path, type: type })
    })
  }, [setDidSave])
  return (
    <div className={"w-screen h-screen" + ((resolvedTheme ?? theme) == 'dark' ? ' dark' : '')}>
      {appState.root && <CanvasSwitcher appState={appState} setAppState={setAppState} />}
      {!appState.root && <Welcome
        openArrangement={openArrangement}
        openMachine={openMachine}
        createArrangement={createArrangement}
        createMachine={createMachine}
      />}
    </div>
  );
}
