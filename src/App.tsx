import { useCallback, useEffect, useState } from 'react'
import './App.css'
import State from './views/State'
import { v4 as uuidv4 } from 'uuid';
import StateInformation from './models/StateInformation';
import Point2D from './models/Point2D';
import Positionable from './views/Positionable';
import Resizable from './views/Resizable';
import Transition from './views/Transition';
import BezierPath from './models/BezierPath';
import TransitionProperties from './models/TransitionProperties';

const initialStates: { [id: string]: StateInformation} = {};

const initialTransitions: { [id: string]:  TransitionProperties} = {};

function addState(...states: StateInformation[]) {
  for (let i = 0; i < states.length; i++) {
    initialStates[states[i].id] = states[i];
  }
}
addState(
  {
    id: uuidv4(),
    properties: {
      name: "Initial",
      w: 200,
      h: 100,
      expanded: false,
      transitions: []
    },
    position: new Point2D(0, 0)
  },
  {
    id: uuidv4(),
    properties: {
      name: "Suspended",
      w: 200,
      h: 100,
      expanded: false,
      transitions: []
    },
    position: new Point2D(0, 200)
  }
);

function createDefaultTransition(): void {
  const newUUID = uuidv4();
  const initialState = Object.keys(initialStates).find(
    (id) => initialStates[id].properties.name == "Initial"
  );
  const suspendedState = Object.keys(initialStates).find(
    (id) => initialStates[id].properties.name == "Suspended"
  );
  initialTransitions[newUUID] = new TransitionProperties(
    initialState!,
    suspendedState!,
    'true',
    new BezierPath(new Point2D(100, 100), new Point2D(100, 200), new Point2D(100, 135), new Point2D(100, 170)),
    'white'
  );
  initialStates[initialState!].properties.transitions = [newUUID];
}

createDefaultTransition();

function App() {
  // const [counter, setCounter] = useState(0);
  const [states, setStates] = useState(initialStates);
  const [transitions, setTransitions] = useState(initialTransitions);
  const [focusedObjects, setFocusedObjects] = useState(new Set<string>());
  const addSelection = useCallback((id: string) => {
    setFocusedObjects((focusedObjects) => {
      const newFocusedObjects = new Set(focusedObjects);
      newFocusedObjects.add(id);
      return newFocusedObjects;
    });
  }, [setFocusedObjects]);
  const uniqueSelection = useCallback((id: string) => {
    setFocusedObjects(new Set([id]));
  }, [setFocusedObjects]);
  const setPath = useCallback((id: string, newPath: BezierPath) => {
    console.log('setPath', id, newPath);
    const transition = transitions[id];
    const newTransitions: { [id: string]: TransitionProperties} = {};
    Object.keys(transitions).forEach((id2) => {
      if (id == id2) {
        newTransitions[id2] = new TransitionProperties(transition.source, transition.target, transition.condition, newPath, transition.color);
      } else {
        newTransitions[id2] = transition;
      }
    });
    setTransitions(newTransitions);
  }, [transitions, setTransitions]);
  const deleteSelection = useCallback(() => {
    setStates((states) => {
      const newStates: { [id: string]: StateInformation} = {};
      Object.keys(states).forEach((id) => {
        if (!focusedObjects.has(id)) {
          newStates[id] = states[id];
        }
      });
      return newStates;
    });
    setTransitions((transitions) => {
      const newTransitions: { [id: string]: TransitionProperties} = {};
      Object.keys(transitions).forEach((id) => {
        if (!focusedObjects.has(id) && !focusedObjects.has(transitions[id].source)) {
          newTransitions[id] = transitions[id];
        }
      });
      return newTransitions;
    });
    setFocusedObjects(new Set());
  }, [focusedObjects, setStates, setTransitions, setFocusedObjects]);
  const deselectAll = useCallback(() => {
    setFocusedObjects(new Set());
  }, [setFocusedObjects]);
  const keyDown = useCallback((e: KeyboardEvent) => {
    if (e.key == 'Escape') {
      deselectAll();
    }
    if (e.key == 'Delete') {
      deleteSelection();
    }
  }, [deselectAll, deleteSelection]);
  useEffect(() => {
    window.addEventListener('keydown', keyDown);
    window.addEventListener('click', deselectAll);
    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('click', deselectAll);
    };
  }, [keyDown, deselectAll]);
  console.log(focusedObjects)
  // const clickMeCB = useCallback(() => {
  //   setCounter(counter + 1);
  //   console.log(`clicked me ${counter} times!`)
  // }, [counter, setCounter]);
  return (
    <div id="canvas">
      {
        Object.keys(transitions).map((id) => {
          const transition = transitions[id];
          return (
            <div key={id}>
              <Transition
                properties={transition}
                isSelected={focusedObjects.has(id)}
                setPath={ (newPath: BezierPath) => setPath(id, newPath) }
                addSelection={()=> addSelection(id)}
                uniqueSelection={() => uniqueSelection(id)}
              ></Transition>
            </div>
          );
        })
      }
      {
        Object.keys(states).map((id) => {
          const state = states[id];
          const setPosition = (newPosition: Point2D) => {
            setStates( (states) => {
              const newStates: { [id: string]: StateInformation} = {};
              Object.keys(states).forEach((id2) => {
                if (id == id2) {
                  newStates[id2] = {
                    id: id2,
                    properties: states[id2].properties,
                    position: newPosition
                  };
                } else {
                  newStates[id2] = states[id2];
                }
              });
              return newStates;
            });
          };
          const setDimensions = (newPosition: Point2D, newDimensions: Point2D) => {
            setStates( (states) => {
              const newStates: { [id: string]: StateInformation} = {};
              Object.keys(states).forEach((id2) => {
                if (id != id2) {
                  newStates[id2] = states[id2];
                  return;
                }
                newStates[id2] = {
                  id: id2,
                  properties: {
                    name: states[id2].properties.name,
                    w: newDimensions.x,
                    h: newDimensions.y,
                    expanded: states[id2].properties.expanded,
                    transitions: states[id2].properties.transitions
                  },
                  position: newPosition
                };
              })
              return newStates;
            });
          };
          return <div key={state.id}>
            <State
              properties={state.properties}
              position={state.position}
              setPosition={setPosition}
              setDimensions={setDimensions}
              isSelected={focusedObjects.has(id)}
              addSelection={() => addSelection(id)}
              uniqueSelection={() => uniqueSelection(id)}
            />
          </div>
        })
      }
    </div>
  )
}

export default App
