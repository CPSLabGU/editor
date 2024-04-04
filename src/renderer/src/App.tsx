// @ts-nocheck

import StateInformation from './models/StateInformation'
import TransitionProperties from './models/TransitionProperties'
import Point2D from './models/Point2D'
import BezierPath from './models/BezierPath'
import { v4 as uuidv4 } from 'uuid'
import Canvas from './views/Canvas'
import { useState, useCallback, useEffect } from 'react'
import './App.css'
import CodeView from './views/CodeView'
import Machine from './models/Machine'
import Clock from './models/Clock'
import { MachineModel, StateModel, StateLayout, TransitionModel, TransitionLayout, ActionModel, machineToModel, modelToMachine } from './models/MachineModel'
import CanvasSwitcherItem from './models/CanvasSwitchItem'
import CanvasSwitcher from './views/CanvasSwitcher'
import { StateDictionary, TransitionDictionary } from './views/MachineView'

type MachineData<T> = { [url: string]: T }

type MachineDictionary = MachineData<Machine>
type MachineStatesDictionary = MachineData<StateDictionary>
type MachineTransitionsDictionary = MachineData<TransitionDictionary>
type URLDictionary = { [url: string]: string }

export default function App() {
  const [machineStates, setMachineStates] = useState<MachineStatesDictionary>({})
  const [machineTransitions, setMachineTransitions] = useState<MachineTransitionsDictionary>({})
  const [machines, setMachines] = useState<MachineDictionary>({})
  useEffect(() => {
    // window.ipc.open((e) => {
    //   setCurrentNumber(0)
    // })
    window.ipc.load((e, data) => {
      const model = MachineModel.fromData(data)
      const { machine, states, transitions } = modelToMachine(model)
      setStates(() => states)
      setTransitions(() => transitions)
      setMachine(machine)
    })
    window.ipc.updateData((e, saveAs) => {
      const model = machineToModel(machine, states, transitions)
      const data = JSON.stringify(model)
      window.ipc.save(data, saveAs)
    })
  }, [setStates, setTransitions, setMachine, machine, states, transitions])
  
}
