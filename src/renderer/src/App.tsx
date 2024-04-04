// @ts-nocheck

import { v4 as uuidv4 } from 'uuid'
import { useState, useCallback, useEffect } from 'react'
import './App.css'
import Machine from './models/Machine'
import { MachineModel, machineToModel, modelToMachine } from './models/MachineModel'
import CanvasSwitcherItem from './models/CanvasSwitchItem'
import CanvasSwitcher, { ItemDictionary } from './views/CanvasSwitcher'
import MachineView, { StateDictionary, TransitionDictionary } from './views/MachineView'

type MachineData<T> = { [id: string]: T }

type MachineDictionary = MachineData<Machine>
type MachineStatesDictionary = MachineData<StateDictionary>
type MachineTransitionsDictionary = MachineData<TransitionDictionary>

const ids: { [url: string]: string } = {}
const urls: { [id: string]: string } = {}

export default function App(): JSX.Element {
  const [machineStates, setMachineStates] = useState<MachineStatesDictionary>({})
  const [machineTransitions, setMachineTransitions] = useState<MachineTransitionsDictionary>({})
  const [machineEdittingState, setMachineEdittingState] = useState<MachineData<string | undefined>>(
    {}
  )
  const [machines, setMachines] = useState<MachineDictionary>({})
  const [root, setRoot] = useState<CanvasSwitcherItem | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<ItemDictionary<boolean>>({})

  const updateMachineView = useCallback(
    (id: string): void => {
      if (!machineStates[id] || !machineTransitions[id] || !machines[id]) {
        return
      }
      const machineView = () => MachineView(
        machineStates[id],
        (setter: (states: StateDictionary) => StateDictionary) => {
          const newMachineStates = { ...machineStates }
          newMachineStates[id] = setter(newMachineStates[id])
          setMachineStates(newMachineStates)
        },
        machineTransitions[id],
        (setter: (transition: TransitionDictionary) => TransitionDictionary) => {
          const newMachineTransitions = { ...machineTransitions }
          newMachineTransitions[id] = setter(newMachineTransitions[id])
          setMachineTransitions(newMachineTransitions)
        },
        machineEdittingState[id],
        (stateID: string | undefined) =>
          setMachineEdittingState((currentEdittingState) => {
            const newEdittingState = { ...currentEdittingState }
            newEdittingState[id] = stateID
            return newEdittingState
          }),
        machines[id],
        (newMachine: Machine) => setMachines((machines) => ({ ...machines, [id]: newMachine }))
      )
      const item = root?.findChild(id)
      if (!item) return
      if (root?.id == id) {
        const newRoot = new CanvasSwitcherItem(root.id, root.title, root.children, machineView)
        setRoot(newRoot)
      } else {
        const newRoot = new CanvasSwitcherItem(root.id, root.title, root.children, root.view)
        const newItem = new CanvasSwitcherItem(item.id, item.title, item.children, machineView)
        newRoot.replaceChild(id, newItem)
        setRoot(newRoot)
      }
    },
    [machineStates, machineTransitions, machineEdittingState, machines]
  )

  useEffect(() => {
    for (const id in machines) {
      updateMachineView(id)
    }
  }, [updateMachineView, machineStates, machineTransitions, machineEdittingState, machines])

  useEffect(() => {
    window.ipc.load((e, data, url) => {
      const model = MachineModel.fromData(data)
      const { machine, states, transitions } = modelToMachine(model)
      const id = ids[url] || uuidv4()
      urls[id] = url
      ids[url] = id
      setMachineStates((currentStates) => {
        const newStates = { ...currentStates }
        newStates[id] = states
        updateMachineView(id)
        return newStates
      })
      setMachineTransitions((currentTransitions) => {
        const newTransitions = { ...currentTransitions }
        newTransitions[id] = transitions
        updateMachineView(id)
        return newTransitions
      })
      setMachines((currentMachines) => {
        const newMachines = { ...currentMachines }
        newMachines[id] = machine
        return newMachines
      })
      setRoot(new CanvasSwitcherItem(id, 'machine', [], () => null))
    })
    window.ipc.updateData((e, saveAs) => {
      const model = machineToModel(machine, states, transitions)
      const data = JSON.stringify(model)
      window.ipc.save(data, saveAs)
    })
  }, [
    machineStates,
    machineTransitions,
    machines,
    setMachineStates,
    setMachineTransitions,
    setMachines
  ])
  if (!root) {
    return <div></div>
  } else {
    return (
      <CanvasSwitcher
        root={root}
        getSelected={() => selected}
        setSelected={setSelected}
        getExpanded={() => expanded}
        setExpanded={setExpanded}
      />
    )
  }
}
