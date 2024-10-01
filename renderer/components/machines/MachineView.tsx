import StateInformation from '../states/StateInformation'
import TransitionProperties from '../transitions/TransitionProperties'
import Canvas from '../canvas/Canvas'
import { useCallback } from 'react'
import CodeView from '../states/CodeView'
import Machine from './Machine'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import VerificationView from '../verification/VerificationView'
import CanvasSidePanel from '../panels/CanvasSidePanel'
import HiddenView from '../util/HiddenView'

export type StateDictionary = { [id: string]: StateInformation }

export type TransitionDictionary = { [id: string]: TransitionProperties }

interface MachineViewArgs {
  id: string,
  machine: Machine
  setMachine: (newMachine: Machine) => void
  sidePanelHidden: boolean
}

export default function MachineView({ id, machine, setMachine, sidePanelHidden }: MachineViewArgs): JSX.Element {
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
    return (
      <Tabs
        defaultValue="canvas"
        value={machine.selectedTab}
        onValueChange={(value) => setMachine(machine.setSelectedTab(value as 'canvas' | 'spec'))}
        className="h-full bg-secondary"
      >
        <TabsList className="h-8 text-secondary-foreground">
          <TabsTrigger value="canvas">Editor</TabsTrigger>
          <TabsTrigger value="spec">Verification</TabsTrigger>
        </TabsList>
        <TabsContent value="canvas" className="w-full bg-background" style={{height: 'calc(100% - 2.5rem)'}}>
          <div className="flex flex-row items-start gap-0 w-full h-full">
            <Canvas machine={machine} setMachine={setMachine} />
            <HiddenView hidden={sidePanelHidden}>
              <CanvasSidePanel machine={machine} setMachine={setMachine} />
            </HiddenView>
          </div>
        </TabsContent>
        <TabsContent value="spec" className="w-full bg-background" style={{height: 'calc(100% - 2.5rem)'}}>
          <VerificationView id={id} machine={machine} setMachine={setMachine} />
        </TabsContent>
      </Tabs>
    );
  }
}
