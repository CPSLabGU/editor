import { useCallback, useEffect, useState } from 'react'
import './Canvas.css'
import State from '../states/State'
import { v4 as uuidv4 } from 'uuid'
import StateInformation from '../states/StateInformation'
import Point2D from '../util/Point2D'
import Transition from '../transitions/Transition'
import BezierPath from '../util/BezierPath'
import TransitionProperties from '../transitions/TransitionProperties'
import WindowContextMenu from '../context_menus/WindowContextMenu'
import StateContextMenu from '../context_menus/StateContextMenu'
import StateIdentifier from '../states/StateIdentifier'
import BoundingBox from '../util/BoundingBox'
import CanvasSidePanel from '../panels/CanvasSidePanel'
import Machine from '../machines/Machine'
import TransitionContextMenu from '../context_menus/TransitionContextMenu'
import StateProperties from '../states/StateProperties'

export default function Canvas({
  machine,
  setMachine
}: {
  machine: Machine
  setMachine: (newMachine: Machine) => void
}): JSX.Element {
  const [focusedObjects, setFocusedObjects] = useState(new Set<string>())
  const [contextState, setContextState] = useState<string | undefined>(undefined)
  const [stateContextMenuPosition, setStateContextMenuPosition] = useState<
    [Point2D, string] | undefined
  >(undefined)
  const [contextMenuPosition, setContextMenuPosition] = useState<Point2D | undefined>(undefined)
  const [transitionContextMenuPosition, setTransitionContextMenuPosition] = useState<
    [Point2D, string] | undefined
  >(undefined)
  const addSelection = useCallback(
    (id: string) => {
      setFocusedObjects((focusedObjects) => {
        const newFocusedObjects = new Set(focusedObjects)
        newFocusedObjects.add(id)
        return newFocusedObjects
      })
    },
    [setFocusedObjects]
  )
  const uniqueSelection = useCallback(
    (id: string) => {
      setFocusedObjects(new Set([id]))
    },
    [setFocusedObjects]
  )
  const setPath = useCallback(
    (id: string, newPath: BezierPath) => {
      const transition = machine.transitions[id]?.shallowCopy
      if (!transition) return
      transition.path = newPath.copy
      setMachine(machine.setTransition(id, transition))
    },
    [machine, setMachine]
  )
  const setCondition = useCallback(
    (id: string, condition: string) => {
      const transition = machine.transitions[id]?.shallowCopy
      if (!transition) return
      transition.condition = condition
      setMachine(machine.setTransition(id, transition))
    },
    [machine, setMachine]
  )
  const deleteSelection = useCallback(() => {
    setMachine(machine.delete(focusedObjects))
    setFocusedObjects(new Set())
  }, [machine, setMachine, focusedObjects, setFocusedObjects])
  const deselectAll = useCallback(
    (latestMachine: Machine | null = null) => {
      const m: Machine = latestMachine ?? machine
      setContextState(undefined)
      setFocusedObjects(new Set())
      setContextMenuPosition(undefined)
      setStateContextMenuPosition(undefined)
      setMachine(m.setEdittingState(null))
      setTransitionContextMenuPosition(undefined)
    },
    [
      machine,
      setFocusedObjects,
      setContextMenuPosition,
      setStateContextMenuPosition,
      setContextState,
      setMachine,
      setTransitionContextMenuPosition
    ]
  )
  const keyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key == 'Escape') {
        deselectAll()
      }
      if (e.key == 'Delete') {
        deleteSelection()
      }
    },
    [deselectAll, deleteSelection]
  )
  const showContextMenu = useCallback(
    (e) => {
      e.preventDefault()
      setContextMenuPosition(new Point2D(e.clientX, e.clientY))
    },
    [setContextMenuPosition]
  )
  useEffect(() => {
    window.addEventListener('keydown', keyDown)
    window.addEventListener('click', () => deselectAll())
    return (): void => {
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('click', () => deselectAll())
    }
  }, [keyDown, deselectAll])
  // const clickMeCB = useCallback(() => {
  //   setCounter(counter + 1);
  //   console.log(`clicked me ${counter} times!`)
  // }, [counter, setCounter]);
  const createState = useCallback(
    (position: Point2D) => {
      const newUUID = uuidv4()
      const newState = new StateInformation(
        newUUID,
        new StateProperties(
          `State ${Object.keys(machine.states).length}`,
          200,
          100,
          false,
          [],
          { OnEntry: '', OnExit: '', Internal: '' },
          '',
          ''
        ),
        position
      )
      deselectAll(machine.addState(newState))
    },
    [machine, deselectAll]
  )
  const showStateContextMenu = useCallback(
    (position: Point2D, id: string) => {
      setContextState(id)
      setContextMenuPosition(undefined)
      setStateContextMenuPosition([position, id])
    },
    [setStateContextMenuPosition]
  )
  const deleteState = useCallback(
    (stateId: string) => {
      setMachine(machine.deleteState(stateId))
      deselectAll()
    },
    [machine, setMachine, deselectAll]
  )
  const setStateTransitions = useCallback(
    (stateId: string, newTransitions: string[]) => {
      setMachine(machine.setStateTransitions(stateId, newTransitions))
    },
    [machine, setMachine]
  )
  const deleteTransition = useCallback(
    (transitionId: string) => {
      deselectAll()
      setMachine(machine.deleteTransition(transitionId))
    },
    [machine, setMachine, deselectAll]
  )
  const createTransition = useCallback(
    (stateID: string, sourceID: string) => {
      const sourceState = machine.states[sourceID]
      const targetState = machine.states[stateID]
      if (!sourceState || !targetState) return
      const source = boundingBox(sourceState)
      const target = boundingBox(targetState)
      const edge = calculateEdge(source, target)
      const newUUID = uuidv4()
      const transition = new TransitionProperties(sourceID, stateID, 'true', edge, 'white')
      setMachine(machine.addTransition(newUUID, transition))
      deselectAll()
    },
    [machine, setMachine, deselectAll]
  )
  const setStatePosition = useCallback(
    (id: string, newPosition: Point2D): void => {
      const state = machine.states[id]?.copy
      if (!state) return
      state.position = newPosition
      setMachine(machine.setState(id, state))
    },
    [machine, setMachine]
  )
  const setStateDimensions = useCallback(
    (id: string, newPosition: Point2D, newDimensions: Point2D): void => {
      const state = machine.states[id]?.copy
      if (!state) return
      state.position = newPosition
      state.properties.w = newDimensions.x
      state.properties.h = newDimensions.y
      setMachine(machine.setState(id, state))
    },
    [machine, setMachine]
  )
  const setEdittingState = useCallback(
    (newEdittingState: string | null): void => {
      setMachine(machine.setEdittingState(newEdittingState))
    },
    [machine, setMachine]
  )
  return (
    <div className="canvas" onContextMenu={showContextMenu}>
      {Object.keys(machine.transitions).map((id) => {
        const transition = machine.transitions[id]
        const priority = Math.max(
          machine.states[transition.source].properties.transitions.indexOf(id),
          0
        )
        return (
          <Transition
            key={id}
            id={id}
            properties={transition}
            priority={priority}
            isSelected={focusedObjects.has(id)}
            setPath={(newPath: BezierPath) => setPath(id, newPath)}
            setCondition={(condition: string) => setCondition(id, condition)}
            addSelection={() => addSelection(id)}
            uniqueSelection={() => uniqueSelection(id)}
            showContextMenu={(position: Point2D) =>
              setTransitionContextMenuPosition([position, id])
            }
          />
        )
      })}
      {Object.keys(machine.states).map((id) => {
        const state = machine.states[id]
        return (
          <State
            key={id}
            properties={state.properties}
            position={state.position}
            setPosition={(newPosition: Point2D): void => setStatePosition(id, newPosition)}
            setDimensions={(newPosition: Point2D, newDimensions: Point2D): void =>
              setStateDimensions(id, newPosition, newDimensions)
            }
            isSelected={focusedObjects.has(id)}
            addSelection={() => addSelection(id)}
            uniqueSelection={() => uniqueSelection(id)}
            showContextMenu={(position: Point2D) => showStateContextMenu(position, id)}
            onDoubleClick={() => setEdittingState(id)}
          />
        )
      })}
      {contextMenuPosition !== undefined && (
        <WindowContextMenu
          position={contextMenuPosition!}
          createState={() => createState(contextMenuPosition)}
        />
      )}
      {stateContextMenuPosition !== undefined && (
        <StateContextMenu
          position={stateContextMenuPosition![0]}
          states={Object.keys(machine.states).map(
            (id: string) => new StateIdentifier(id, machine.states[id].properties.name)
          )}
          createTransition={(stateID: string) => createTransition(stateID, contextState!)}
          deleteState={() => deleteState(stateContextMenuPosition![1])}
          setInitialState={() => {
            if (!contextState) return
            setMachine(machine.setInitialState(contextState))
          }}
          setSuspendedState={() => {
            setMachine(machine.setSuspendedState(contextState))
          }}
        />
      )}
      {transitionContextMenuPosition !== undefined && (
        <TransitionContextMenu
          position={transitionContextMenuPosition![0]}
          id={transitionContextMenuPosition![1]}
          transitions={
            machine.states[machine.transitions[transitionContextMenuPosition![1]].source].properties
              .transitions
          }
          setTransitions={(newTransitions: string[]) =>
            setStateTransitions(
              machine.transitions[transitionContextMenuPosition![1]].source,
              newTransitions
            )
          }
          deleteTransition={() => deleteTransition(transitionContextMenuPosition![1])}
        />
      )}
      <CanvasSidePanel machine={machine} setMachine={setMachine} />
    </div>
  )
}

function boundingBox(state: StateInformation): BoundingBox {
  return new BoundingBox(state.position.x, state.position.y, state.properties.w, state.properties.h)
}

function calculateEdge(source: BoundingBox, target: BoundingBox): BezierPath {
  const sourceCentre = new Point2D(source.x + source.width / 2, source.y + source.height / 2)
  const targetCentre = new Point2D(target.x + target.width / 2, target.y + target.height / 2)
  const angle = Math.atan2(targetCentre.y - sourceCentre.y, targetCentre.x - sourceCentre.x)
  const sourcePoint = source.findIntersection(angle)
  const targetAngle = angle + Math.PI
  const targetPoint = target.findIntersection(targetAngle)
  const dx = targetPoint.x - sourcePoint.x
  const dy = targetPoint.y - sourcePoint.y
  return new BezierPath(
    sourcePoint,
    targetPoint,
    new Point2D(sourcePoint.x + dx / 3, sourcePoint.y + dy / 3),
    new Point2D(sourcePoint.x + (2 * dx) / 3, sourcePoint.y + (2 * dy) / 3)
  )
}
