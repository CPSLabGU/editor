import Arrangement from './Arrangement'
import Clock from '../clocks/Clock'
import { useCallback } from 'react'
import CodeEditor from '../code_editor/CodeEditor'
import ManageListView from '../manage_list/ManageListView'
import ClockView from '../clocks/ClockView'
import MachineReference from '../machine_reference/MachineReference'
import MachineReferenceView from '../machine_reference/MachineReferenceView'
import { machine } from 'os'
import { ScrollArea } from '../ui/scroll-area'

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
  const titleViewForClocks = useCallback((button: JSX.Element) => <h2>Clocks {button}</h2>, [])
  const triggerViewForClock = useCallback(
    (id: string, clock: Clock) => (
      <>{clock.name}</>
    ),
    []
  )
  const viewForClock = useCallback(
    (id: string, clock: Clock, setClock: (newClock: Clock) => void, deleteClock: () => void) => (
      <ClockView key={id} buttonVariant='secondary' clock={clock} setClock={setClock} deleteClock={deleteClock} />
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
  const titleViewForMachines = useCallback((button: JSX.Element) => <h2>Machines {button}</h2>, [])
  const triggerViewForMachine = useCallback(
    (id: string, machine: MachineReference) => (
      <>{machine.name}</>
    ),
    []
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
    <ScrollArea className="w-full h-full">
      <div className="p-4 w-full h-full">
        <form onSubmit={(e) => e.preventDefault()}>
          <ManageListView
            list={arrangement.clocks}
            setList={changeClocks}
            emptyElement={emptyClock}
            titleView={titleViewForClocks}
            triggerView={triggerViewForClock}
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
          <ManageListView
            titleView={titleViewForMachines}
            list={arrangement.machines}
            setList={changeMachines}
            emptyElement={emptyMachine}
            triggerView={triggerViewForMachine}
            view={viewForMachine}
          />
        </form>
      </div>
    </ScrollArea>
  )
}
