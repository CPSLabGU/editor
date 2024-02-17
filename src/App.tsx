import { useCallback, useState } from 'react'
import './App.css'
import State from './views/State'
import { v4 as uuidv4 } from 'uuid';
import StateInformation from './models/StateInformation';
import Point2D from './models/Point2D';

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
      {states.map((state) => {
        const stateStyle = {
          left: state.position.x,
          top: state.position.y,
        };
        return <div key={state.id} className='state' style={stateStyle}><State {...state.properties}></State></div>
      })}
    </div>
  )
}

export default App
