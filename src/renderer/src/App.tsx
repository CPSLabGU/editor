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

const initialStates: { [id: string]: StateInformation } = {}

const initialTransitions: { [id: string]: TransitionProperties } = {}

function addState(...states: StateInformation[]): void {
  for (let i = 0; i < states.length; i++) {
    initialStates[states[i].id] = states[i]
  }
}
addState(
  {
    id: uuidv4(),
    properties: {
      name: 'Initial',
      w: 200,
      h: 100,
      expanded: false,
      transitions: [],
      actions: { OnEntry: '', OnExit: '', Internal: '' },
      variables: '',
      externalVariables: ''
    },
    position: new Point2D(0, 0)
  },
  {
    id: uuidv4(),
    properties: {
      name: 'Suspended',
      w: 200,
      h: 100,
      expanded: false,
      transitions: [],
      actions: { OnEntry: '', OnExit: '', Internal: '' },
      variables: '',
      externalVariables: ''
    },
    position: new Point2D(0, 200)
  }
)

function createDefaultTransition(): void {
  const newUUID = uuidv4()
  const initialState = Object.keys(initialStates).find(
    (id) => initialStates[id].properties.name == 'Initial'
  )
  const suspendedState = Object.keys(initialStates).find(
    (id) => initialStates[id].properties.name == 'Suspended'
  )
  initialTransitions[newUUID] = new TransitionProperties(
    initialState!,
    suspendedState!,
    'true',
    new BezierPath(
      new Point2D(100, 100),
      new Point2D(100, 200),
      new Point2D(100, 135),
      new Point2D(100, 170)
    ),
    'white'
  )
  initialStates[initialState!].properties.transitions = [newUUID]
}

createDefaultTransition()

function defaultMachine(): Machine {
  const initialState = Object.keys(initialStates).find(
    (id) => initialStates[id].properties.name == 'Initial'
  )
  const suspendedState = Object.keys(initialStates).find(
    (id) => initialStates[id].properties.name == 'Suspended'
  )
  return new Machine('', '', '', initialState, suspendedState, new Array<Clock>())
}

export default function App() {
  // const [counter, setCounter] = useState(0);
  const [states, setStates] = useState(initialStates)
  const [transitions, setTransitions] = useState(initialTransitions)
  const [edittingState, setEdittingState] = useState<string | undefined>(undefined)
  const [currentMachine, setCurrentMachine] = useState(defaultMachine())
  // const [currentNumber, setCurrentNumber] = useState(0)
  useEffect(() => {
    // window.ipc.open((e) => {
    //   setCurrentNumber(0)
    // })
    window.ipc.load((e, data) => {
      console.log('Reading model.')
      const parsedModel = JSON.parse(data)
      const model = new MachineModel(
        parsedModel.states.map((state) => {
          return new StateModel(
            state.name,
            state.variables,
            state.externalVariables,
            state.actions.map((action) => new ActionModel(action.name, action.code)),
            new StateLayout(
              new Point2D(state.layout.position.x, state.layout.position.y),
              new Point2D(state.layout.dimensions.x, state.layout.dimensions.y)
            )
          )
        }),
        parsedModel.externalVariables,
        parsedModel.machineVariables,
        parsedModel.includes,
        parsedModel.transitions.map((transition) => {
          return new TransitionModel(
            transition.source,
            transition.target,
            transition.condition,
            new TransitionLayout(
              new BezierPath(
                new Point2D(transition.layout.path.source.x, transition.layout.path.source.y),
                new Point2D(transition.layout.path.target.x, transition.layout.path.target.y),
                new Point2D(transition.layout.path.control0.x, transition.layout.path.control0.y),
                new Point2D(transition.layout.path.control1.x, transition.layout.path.control1.y)
              )
            )
          )
        }),
        parsedModel.initialState,
        parsedModel.suspendedState,
        parsedModel.clocks.map((clock) => {
          return new Clock(clock.name, clock.frequency)
        })
      )
      console.log('Read model ', model)
      const { machine, states, transitions } = modelToMachine(model)
      console.log('Created machine ', machine, states, transitions)
      Object.values(transitions).forEach((t) => {
        console.log(t.path.boundingBox);
      });
      setStates(states)
      setTransitions(transitions)
      setCurrentMachine(machine)
    })
    window.ipc.updateData((e, saveAs) => {
      const model = machineToModel(currentMachine, states, transitions)
      const data = JSON.stringify(model)
      window.ipc.save(data, saveAs)
    })
  }, [
    // setCurrentNumber,
    setStates,
    setTransitions,
    setCurrentMachine,
    currentMachine,
    states,
    transitions
  ])
  // const dialog = window.require('electron').dialog

  // const showDevTools = useCallback((e: KeyboardEvent) => {
  //   if (e.shiftKey && e.ctrlKey && e.key === 'J') {
  //     remote.getCurrentWindow().toggleDevTools()
  //   }
  // }, []);
  // const showTest = async (): void => {
  //   const number = await window.ipc.test()
  //   setCurrentNumber(number)
  //   window.ipc.print('Hello World!')
  // }
  const setStateName = useCallback(
    (id: string, name: string) => {
      const state = states[id]
      if (!state) return
      const newStates: { [id: string]: StateInformation } = { ...states }
      newStates[id] = {
        id: state.id,
        properties: {
          name: name,
          w: state.properties.w,
          h: state.properties.h,
          expanded: state.properties.expanded,
          transitions: state.properties.transitions,
          actions: state.properties.actions,
          variables: state.properties.variables,
          externalVariables: state.properties.externalVariables
        },
        position: state.position
      }
      setStates(() => newStates)
    },
    [states, setStates]
  )
  const setStateVariables = useCallback(
    (id: string, variables: string) => {
      const state = states[id]
      if (!state) return
      const newStates: { [id: string]: StateInformation } = { ...states }
      newStates[id] = {
        id: state.id,
        properties: {
          name: state.properties.name,
          w: state.properties.w,
          h: state.properties.h,
          expanded: state.properties.expanded,
          transitions: state.properties.transitions,
          actions: state.properties.actions,
          variables: variables,
          externalVariables: state.properties.externalVariables
        },
        position: state.position
      }
      setStates(() => newStates)
    },
    [states, setStates]
  )
  const setExternalVariables = useCallback(
    (id: string, externalVariables: string) => {
      const state = states[id]
      if (!state) return
      const newStates: { [id: string]: StateInformation } = { ...states }
      newStates[id] = {
        id: state.id,
        properties: {
          name: state.properties.name,
          w: state.properties.w,
          h: state.properties.h,
          expanded: state.properties.expanded,
          transitions: state.properties.transitions,
          actions: state.properties.actions,
          variables: state.properties.variables,
          externalVariables: externalVariables
        },
        position: state.position
      }
      setStates(() => newStates)
    },
    [states, setStates]
  )
  if (edittingState !== undefined) {
    return (
      <>
        <CodeView
          actions={states[edittingState].properties.actions}
          language="javascript"
          state={states[edittingState].properties.name}
          variables={states[edittingState].properties.variables}
          externalVariables={states[edittingState].properties.externalVariables}
          setActions={(action: string, code: string) => {
            states[edittingState].properties.actions[action] = code
          }}
          setState={(name: string) => {
            setStateName(edittingState, name)
          }}
          setVariables={(variables: string) => {
            setStateVariables(edittingState, variables)
          }}
          setExternalVariables={(externalVariables: string) => {
            setExternalVariables(edittingState, externalVariables)
          }}
          onExit={() => setEdittingState(undefined)}
        />
      </>
    )
  } else {
    return (
      <>
        <Canvas
          states={states}
          transitions={transitions}
          machine={currentMachine}
          setStates={setStates}
          setTransitions={setTransitions}
          setEdittingState={setEdittingState}
          setMachine={setCurrentMachine}
        />
      </>
    )
  }
}
