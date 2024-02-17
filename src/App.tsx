import { useCallback, useState } from 'react'
import './App.css'
import State from './views/State'
import { v4 as uuidv4 } from 'uuid';
import StateInformation from './models/StateInformation';
import Point2D from './models/Point2D';
import Positionable from './views/Positionable';
import Resizable from './views/Resizable';
import Transition from './views/Transition';
import BezierPath from './models/BezierPath';

const initialStates: { [id: string]: StateInformation} = {};

function addState(...states: StateInformation[]) {
  for (let i = 0; i < states.length; i++) {
    initialStates[states[i].id] = states[i];
  }
}
addState(
  {
    id: uuidv4(),
    properties: {
      name: "State0",
      w: 100,
      h: 100,
      expanded: false,
    },
    position: new Point2D(0, 0)
  },
  {
    id: uuidv4(),
    properties: {
      name: "State1",
      w: 100,
      h: 100,
      expanded: false,
    },
    position: new Point2D(30, 30)
  },
  {
    id: uuidv4(),
    properties: {
      name: "State2",
      w: 100,
      h: 100,
      expanded: false,
    },
    position: new Point2D(60, 60)
  }
);

function App() {
  // const [counter, setCounter] = useState(0);
  const [states, setStates] = useState(initialStates);
  // const clickMeCB = useCallback(() => {
  //   setCounter(counter + 1);
  //   console.log(`clicked me ${counter} times!`)
  // }, [counter, setCounter]);
  return (
    <div id="canvas">
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
          return <div key={state.id}>
            <Positionable position={state.position} setPosition={setPosition}>
              <Resizable
                dimensions={
                  {
                    dimensions: new Point2D(state.properties.w, state.properties.h),
                    minDimensions: new Point2D(200, 100),
                    maxDimensions: new Point2D(400, 400)
                  }
                }
                setDimensions={(newPosition: Point2D, newDimensions: Point2D)=> {
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
                          expanded: states[id2].properties.expanded
                        },
                        position: newPosition
                      };
                    })
                    return newStates;
                  });
                }}
                position={state.position}
              >
                <State {...state.properties} />
              </Resizable>
            </Positionable>
          </div>
        })
      }
      <Transition
        source={uuidv4()}
        target={uuidv4}
        condition='true'
        path={new BezierPath(new Point2D(0, 0), new Point2D(100, 100), new Point2D(50, 0), new Point2D(50, 100))}
        color='white'
      ></Transition>
    </div>
  )
}

export default App
