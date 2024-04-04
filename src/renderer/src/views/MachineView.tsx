// @ts-nocheck

import StateInformation from '../models/StateInformation'
import TransitionProperties from '../models/TransitionProperties'
import Canvas from '../views/Canvas'
import { useCallback } from 'react'
import CodeView from './CodeView'
import Machine from '../models/Machine'

export type StateDictionary = { [id: string]: StateInformation }

export type TransitionDictionary = { [id: string]: TransitionProperties }

interface MachineViewArgs {
  states: StateDictionary
  setStates: (setter: (states: StateDictionary) => StateDictionary) => void
  transitions: TransitionDictionary
  setTransitions: (setter: (transitions: TransitionDictionary) => TransitionDictionary) => void
  edittingState: string | undefined
  setEdittingState: (id: string | undefined) => void
  machine: Machine
  setMachine: (newMachine: Machine) => void
}

export default function MachineView({
  states,
  setStates,
  transitions,
  setTransitions,
  edittingState,
  setEdittingState,
  machine,
  setMachine
}: MachineViewArgs): JSX.Element {
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
          machine={machine}
          setStates={setStates}
          setTransitions={setTransitions}
          setEdittingState={setEdittingState}
          setMachine={setMachine}
        />
      </>
    )
  }
}
