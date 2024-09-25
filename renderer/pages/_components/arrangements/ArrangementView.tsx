import Arrangement from './Arrangement'
import Clock from '../clocks/Clock'
import { useCallback } from 'react'
import CodeEditor from '../code_editor/CodeEditor'
import ManageListView from '../manage_list/ManageListView'
import ClockView from '../clocks/ClockView'
import MachineReference from '../machine_reference/MachineReference'
import MachineReferenceView from '../machine_reference/MachineReferenceView'

interface ArrangementViewArgs {
  arrangement: Arrangement
  setArrangement: (newArrangement: Arrangement) => void
}

export default function ArrangementView({
  arrangement,
  setArrangement
}: ArrangementViewArgs): JSX.Element {
  const emptyClock = useCallback(() => arrangement.emptyClock, [arrangement])
  const changeClocks = useCallback(
    (setter: (currentClocks: { [id: string]: Clock }) => { [id: string]: Clock }) => {
      const newClocks = setter(arrangement.clocks)
      setArrangement(arrangement.setClocks(newClocks))
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
      setArrangement(arrangement.setExternalVariables(newExternalVariables))
    },
    [arrangement, setArrangement]
  )
  const changeGlobalVariables = useCallback(
    (newGlobalVariables: string) => {
      setArrangement(arrangement.setGlobalVariables(newGlobalVariables))
    },
    [arrangement, setArrangement]
  )
  const emptyMachine = useCallback(() => arrangement.emptyMachine, [arrangement])
  const changeMachines = useCallback(
    (
      setter: (currentMachines: { [id: string]: MachineReference }) => {
        [id: string]: MachineReference
      }
    ) => {
      const newMachines = setter(arrangement.machines)
      setArrangement(arrangement.setMachines(newMachines))
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
        <ManageListView
          list={arrangement.clocks}
          setList={changeClocks}
          emptyElement={emptyClock}
          view={viewForClock}
        />
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
          emptyElement={emptyMachine}
          view={viewForMachine}
        />
      </form>
    </div>
  )
}
