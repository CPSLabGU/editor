import { useCallback, useState } from 'react'
import './App.css'
import State from './views/State'
import { v4 as uuidv4 } from 'uuid';
import StateInformation from './models/StateInformation';
import Point2D from './models/Point2D';
import Positionable from './views/Positionable';

const initialStates: [StateInformation] = [
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
]

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
        states.map((state, index) => {
          const setPosition = (newPosition: Point2D) => {
            setStates( (states) => states.map((s, i) => {
              if (i == index) {
                return {
                  id: states[i].id,
                  properties: states[i].properties,
                  position: newPosition
                };
              }
              return s;
            }) as [StateInformation]);
          };
          return <div key={state.id}>
            <Positionable position={state.position} setPosition={setPosition}>
              <State {...state.properties} />
            </Positionable>
          </div>
        })
      }
    </div>
  )
}

export default App
