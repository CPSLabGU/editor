// @ts-nocheck

import { useCallback, useEffect, useState } from 'react'
import '../styles/Canvas.css'
import State from '../views/State'
import { v4 as uuidv4 } from 'uuid'
import StateInformation from '../models/StateInformation'
import Point2D from '../models/Point2D'
import Transition from '../views/Transition'
import BezierPath from '../models/BezierPath'
import TransitionProperties from '../models/TransitionProperties'
import WindowContextMenu from '../views/WindowContextMenu'
import StateContextMenu from '../views/StateContextMenu'
import StateIdentifier from '../models/StateIdentifier'
import BoundingBox from '../models/BoundingBox'
import CanvasSidePanel from './CanvasSidePanel'
import Machine from '../models/Machine'
import TransitionContextMenu from './TransitionContextMenu'

export default function Canvas({
  states,
  transitions,
  machine,
  setStates,
  setTransitions,
  setEdittingState
}: {
  states: { [id: string]: StateInformation }
  transitions: { [id: string]: TransitionProperties }
  machine: Machine
  setStates: (
    f: (states: { [id: string]: StateInformation }) => { [id: string]: StateInformation }
  ) => void
  setTransitions: (
    f: (transitions: { [id: string]: TransitionProperties }) => {
      [id: string]: TransitionProperties
    }
  ) => void
  setEdittingState: (id: string | undefined) => void
}) {
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
      const transition = transitions[id]
      if (!transition) return
      const newTransitions: { [id: string]: TransitionProperties } = { ...transitions }
      newTransitions[id] = new TransitionProperties(
        transition.source,
        transition.target,
        transition.condition,
        newPath,
        transition.color
      )
      setTransitions(() => newTransitions)
    },
    [transitions, setTransitions]
  )
  const setCondition = useCallback(
    (id: string, condition: string) => {
      const transition = transitions[id]
      if (!transition) return
      const newTransitions: { [id: string]: TransitionProperties } = { ...transitions }
      newTransitions[id] = new TransitionProperties(
        transition.source,
        transition.target,
        condition,
        transition.path,
        transition.color
      )
      setTransitions(() => newTransitions)
    },
    [transitions, setTransitions]
  )
  const deleteSelection = useCallback(() => {
    setStates((states) => {
      const newStates: { [id: string]: StateInformation } = {}
      Object.keys(states).forEach((id) => {
        if (!focusedObjects.has(id)) {
          newStates[id] = states[id]
          newStates[id].properties.transitions = newStates[id].properties.transitions.filter(
            (v) => !focusedObjects.has(v)
          )
        }
      })
      return newStates
    })
    setTransitions((transitions) => {
      const newTransitions: { [id: string]: TransitionProperties } = {}
      Object.keys(transitions).forEach((id) => {
        if (
          !focusedObjects.has(id) &&
          !focusedObjects.has(transitions[id].source) &&
          !focusedObjects.has(transitions[id].target)
        ) {
          newTransitions[id] = transitions[id]
        }
      })
      return newTransitions
    })
    setFocusedObjects(new Set())
  }, [focusedObjects, setStates, setTransitions, setFocusedObjects, states])
  const deselectAll = useCallback(() => {
    setContextState(undefined)
    setFocusedObjects(new Set())
    setContextMenuPosition(undefined)
    setStateContextMenuPosition(undefined)
    setEdittingState(undefined)
    setTransitionContextMenuPosition(undefined)
  }, [
    setFocusedObjects,
    setContextMenuPosition,
    setStateContextMenuPosition,
    setEdittingState,
    setContextState,
    setTransitionContextMenuPosition
  ])
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
    window.addEventListener('click', deselectAll)
    return () => {
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('click', deselectAll)
    }
  }, [keyDown, deselectAll])
  // const clickMeCB = useCallback(() => {
  //   setCounter(counter + 1);
  //   console.log(`clicked me ${counter} times!`)
  // }, [counter, setCounter]);
  const createState = useCallback(
    (position: Point2D) => {
      setStates((states) => {
        const newStates = { ...states }
        const newUUID = uuidv4()
        newStates[newUUID] = {
          id: newUUID,
          properties: {
            name: `State ${Object.keys(states).length}`,
            w: 200,
            h: 100,
            expanded: false,
            transitions: [],
            actions: { onEntry: '', onExit: '', Internal: '' },
            variables: '',
            externalVariables: ''
          },
          position: position
        }
        return newStates
      })
      deselectAll()
    },
    [setStates, deselectAll]
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
      setStates((states) => {
        const newStates = { ...states }
        delete newStates[stateId]
        return newStates
      })
      setTransitions((transitions) => {
        const newTransitions: { [id: string]: TransitionProperties } = {}
        Object.keys(transitions).forEach((id) => {
          if (transitions[id].source != stateId && transitions[id].target != stateId) {
            newTransitions[id] = transitions[id]
          }
        })
        return newTransitions
      })
      deselectAll()
    },
    [setStates, setTransitions, deselectAll]
  )
  const setStateTransitions = useCallback(
    (stateId: string, newTransitions: string[]) => {
      setStates((states) => {
        const newStates = { ...states }
        newStates[stateId] = {
          ...newStates[stateId],
          properties: {
            ...newStates[stateId].properties,
            transitions: newTransitions
          }
        }
        return newStates
      })
    },
    [setStates]
  )
  const deleteTransition = useCallback((transitionId: string) => {
    deselectAll()
    setStates((states) => {
      const stateID = transitions[transitionId].source
      const state = states[stateID]
      if (!state) return states
      const newStates: { [id: string]: StateInformation } = { ...states }
      newStates[stateID] = {
        ...state,
        properties: {
          ...state.properties,
          transitions: state.properties.transitions.filter((v) => v != transitionId)
        }
      }
      return newStates
    })
    setTransitions((transitions) => {
      const newTransitions: { [id: string]: TransitionProperties } = { ...transitions }
      delete newTransitions[transitionId]
      return newTransitions
    })
  })
  const createTransition = useCallback(
    (stateID: string, sourceID: string) => {
      const sourceState = boundingBox(states[sourceID])
      const target = boundingBox(states[stateID])
      const edge = calculateEdge(sourceState, target)
      const newUUID = uuidv4()
      setTransitions((transitions) => {
        const newTransitions = { ...transitions }
        newTransitions[newUUID] = new TransitionProperties(sourceID, stateID, 'true', edge, 'white')
        return newTransitions
      })
      setStates((states) => {
        const newStates = { ...states }
        if (
          newStates[sourceID].properties.transitions.find((v) => {
            return v == newUUID
          }) === undefined
        ) {
          newStates[sourceID].properties.transitions.push(newUUID)
        }
        return newStates
      })
      deselectAll()
    },
    [setTransitions, setStates, deselectAll, states]
  )
  return (
    <div className="canvas" onContextMenu={showContextMenu}>
      {Object.keys(transitions).map((id) => {
        const transition = transitions[id]
        const priority = Math.max(states[transition.source].properties.transitions.indexOf(id), 0)
        return (
          <div key={id}>
            <Transition
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
            ></Transition>
          </div>
        )
      })}
      {Object.keys(states).map((id) => {
        const state = states[id]
        const setPosition = (newPosition: Point2D) => {
          setStates((states) => {
            const newStates: { [id: string]: StateInformation } = {}
            Object.keys(states).forEach((id2) => {
              if (id == id2) {
                newStates[id2] = {
                  id: id2,
                  properties: states[id2].properties,
                  position: newPosition
                }
              } else {
                newStates[id2] = states[id2]
              }
            })
            return newStates
          })
        }
        const setDimensions = (newPosition: Point2D, newDimensions: Point2D) => {
          setStates((states) => {
            const newStates: { [id: string]: StateInformation } = {}
            Object.keys(states).forEach((id2) => {
              if (id != id2) {
                newStates[id2] = states[id2]
                return
              }
              newStates[id2] = {
                ...states[id2],
                properties: {
                  ...states[id2].properties,
                  w: newDimensions.x,
                  h: newDimensions.y
                },
                position: newPosition
              }
            })
            return newStates
          })
        }
        return (
          <div key={state.id}>
            <State
              properties={state.properties}
              position={state.position}
              setPosition={setPosition}
              setDimensions={setDimensions}
              isSelected={focusedObjects.has(id)}
              addSelection={() => addSelection(id)}
              uniqueSelection={() => uniqueSelection(id)}
              showContextMenu={(position: Point2D) => showStateContextMenu(position, id)}
              onDoubleClick={() => setEdittingState(id)}
            />
          </div>
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
          states={Object.keys(states).map(
            (id: string) => new StateIdentifier(id, states[id].properties.name)
          )}
          createTransition={(stateID: string) => createTransition(stateID, contextState!)}
          deleteState={() => deleteState(stateContextMenuPosition![1])}
        />
      )}
      {transitionContextMenuPosition !== undefined && (
        <TransitionContextMenu
          position={transitionContextMenuPosition![0]}
          id={transitionContextMenuPosition![1]}
          transitions={
            states[transitions[transitionContextMenuPosition![1]].source].properties.transitions
          }
          setTransitions={(newTransitions: string[]) =>
            setStateTransitions(
              transitions[transitionContextMenuPosition![1]].source,
              newTransitions
            )
          }
          deleteTransition={() => deleteTransition(transitionContextMenuPosition![1])}
        />
      )}
      <CanvasSidePanel machine={machine} />
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
