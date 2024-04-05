import Arrangement from './Arrangement'
import Clock from '../clocks/Clock'
import { useCallback } from 'react'
import CodeEditor from '../code_editor/CodeEditor'
import ManageListView from '../manage_list/ManageListView'
import ClockView from '../clocks/ClockView'
import MachineReference from './MachineReference'
import MachineReferenceView from './MachineReferenceView'

interface ArrangementViewArgs {
  arrangement: Arrangement
  setArrangement: (newArrangement: Arrangement) => void
}

export default function ArrangementView({
  arrangement,
  setArrangement
}: ArrangementViewArgs): JSX.Element {
  const changeClocks = useCallback(
    (setter: (currentClocks: { [id: string]: Clock }) => { [id: string]: Clock }) => {
      const newClocks = setter(arrangement.clocks)
      setArrangement(
        new Arrangement(
          arrangement.language,
          newClocks,
          arrangement.externalVariables,
          arrangement.machines,
          arrangement.globalVariables
        )
      )
    },
    [arrangement, setArrangement]
  )
  const viewForClock = useCallback(
    (id: string, clock: Clock, setClock: (newClock: Clock) => void, deleteClock: () => void) => (
      <ClockView key={id} clock={clock} setClock={setClock} deleteClock={deleteClock} />
    ),
    []
  )
  const changeExternalVariables = useCallback(
    (newExternalVariables: string) => {
      setArrangement(
        new Arrangement(
          arrangement.language,
          arrangement.clocks,
          newExternalVariables,
          arrangement.machines,
          arrangement.globalVariables
        )
      )
    },
    [arrangement, setArrangement]
  )
  const changeGlobalVariables = useCallback(
    (newGlobalVariables: string) => {
      setArrangement(
        new Arrangement(
          arrangement.language,
          arrangement.clocks,
          arrangement.externalVariables,
          arrangement.machines,
          newGlobalVariables
        )
      )
    },
    [arrangement, setArrangement]
  )
  const changeMachines = useCallback(
    (
      setter: (currentMachines: { [id: string]: MachineReference }) => {
        [id: string]: MachineReference
      }
    ) => {
      const newMachines = setter(arrangement.machines)
      setArrangement(
        new Arrangement(
          arrangement.language,
          arrangement.clocks,
          arrangement.externalVariables,
          newMachines,
          arrangement.globalVariables
        )
      )
    },
    [arrangement, setArrangement]
  )
  const viewForMachine = useCallback(
    (
      id: string,
      machine: MachineReference,
      setMachine: (newMachine: MachineReference) => void,
      deleteMachine: () => void
    ) => (
      <MachineReferenceView
        key={id}
        machineReference={machine}
        setMachineReference={setMachine}
        deleteMachineReference={deleteMachine}
      />
    ),
    []
  )
  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <h2>Clocks</h2>
        <ManageListView list={arrangement.clocks} setList={changeClocks} view={viewForClock} />
        <h2>External Variables</h2>
        <CodeEditor
          language={arrangement.language}
          sourcecode={arrangement.externalVariables}
          setSourceCode={changeExternalVariables}
        />
        <h2>Global Variables</h2>
        <CodeEditor
          language={arrangement.language}
          sourcecode={arrangement.globalVariables}
          setSourceCode={changeGlobalVariables}
        />
        <h2>Machines</h2>
        <ManageListView
          list={arrangement.machines}
          setList={changeMachines}
          view={viewForMachine}
        />
      </form>
    </div>
  )
}
