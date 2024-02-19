// @ts-nocheck

import StateInformation from './models/StateInformation'
import TransitionProperties from './models/TransitionProperties'
import Point2D from './models/Point2D'
import BezierPath from './models/BezierPath'
import { v4 as uuidv4 } from 'uuid'
import Canvas from './views/Canvas'
import { useState, useCallback } from 'react'
import './App.css'
import CodeView from './views/CodeView'
import Machine from './models/Machine'

const initialStates: { [id: string]: StateInformation } = {}

const initialTransitions: { [id: string]: TransitionProperties } = {}

function addState(...states: StateInformation[]) {
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
      actions: { onEntry: '', onExit: '', Internal: '' }
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
      actions: { onEntry: '', onExit: '', Internal: '' }
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

export default function App() {
  // const [counter, setCounter] = useState(0);
  const [states, setStates] = useState(initialStates)
  const [transitions, setTransitions] = useState(initialTransitions)
  const [edittingState, setEdittingState] = useState<string | undefined>(undefined)
  const [currentMachine, setCurrentMachine] = useState(new Machine('', '', ''))

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
          actions: state.properties.actions
        },
        position: state.position
      }
      setStates(() => newStates)
    },
    [states, setStates]
  )
  if (edittingState !== undefined) {
    return (
      <CodeView
        actions={states[edittingState].properties.actions}
        language="javascript"
        state={states[edittingState].properties.name}
        setActions={(action: string, code: string) => {
          states[edittingState].properties.actions[action] = code
        }}
        setState={(name: string) => {
          setStateName(edittingState, name)
        }}
        onExit={() => setEdittingState(undefined)}
      />
    )
  } else {
    return (
      <Canvas
        states={states}
        transitions={transitions}
        machine={currentMachine}
        setStates={setStates}
        setTransitions={setTransitions}
        setEdittingState={setEdittingState}
      />
    )
  }
}
