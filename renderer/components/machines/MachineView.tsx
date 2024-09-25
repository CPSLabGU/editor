import StateInformation from '../states/StateInformation'
import TransitionProperties from '../transitions/TransitionProperties'
import Canvas from '../canvas/Canvas'
import { useCallback } from 'react'
import CodeView from '../states/CodeView'
import Machine from './Machine'

export type StateDictionary = { [id: string]: StateInformation }

export type TransitionDictionary = { [id: string]: TransitionProperties }

interface MachineViewArgs {
  machine: Machine
  setMachine: (newMachine: Machine) => void
}

export default function MachineView({ machine, setMachine }: MachineViewArgs): JSX.Element {
  const setStateName = useCallback(
    (id: string, name: string) => {
      const state = machine.states[id]?.copy
      if (!state) return
      state.properties.name = name
      setMachine(machine.setState(id, state))
    },
    [machine, setMachine]
  )
  const setStateVariables = useCallback(
    (id: string, variables: string) => {
      const state = machine.states[id]?.copy
      if (!state) return
      state.properties.variables = variables
      setMachine(machine.setState(id, state))
    },
    [machine, setMachine]
  )
  const setExternalVariables = useCallback(
    (id: string, externalVariables: string) => {
      const state = machine.states[id]?.copy
      if (!state) return
      state.properties.externalVariables = externalVariables
      setMachine(machine.setState(id, state))
    },
    [machine, setMachine]
  )
  const setAction = useCallback(
    (id: string, action: string, code: string) => {
      const state = machine.states[id]?.copy
      if (!state) return
      state.properties.actions[action] = code
      setMachine(machine.setState(id, state))
    },
    [machine, setMachine]
  )
  const setEdittingState = useCallback(
    (newEdittingState: string | null) => {
      setMachine(machine.setEdittingState(newEdittingState))
    },
    [machine, setMachine]
  )
  if (machine.edittingState !== null && machine.states[machine.edittingState]) {
    const edittingState = machine.edittingState
    return (
      <CodeView
        actions={machine.states[edittingState].properties.actions}
        language="javascript"
        state={machine.states[edittingState].properties.name}
        variables={machine.states[edittingState].properties.variables}
        externalVariables={machine.states[edittingState].properties.externalVariables}
        setActions={(action: string, code: string) => {
          setAction(edittingState, action, code)
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
        onExit={() => setEdittingState(null)}
      />
    )
  } else {
    return <Canvas machine={machine} setMachine={setMachine} />
  }
}
