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
    position: new Point2D(100, 100)
  },
  {
    id: uuidv4(),
    properties: {
      name: "State2",
      w: 100,
      h: 100,
      expanded: false,
    },
    position: new Point2D(200, 200)
  }
]

function App() {
  const [counter, setCounter] = useState(0);
  const [states, setStates] = useState(initialStates);
  const clickMeCB = useCallback(() => {
    setCounter(counter + 1);
    console.log(`clicked me ${counter} times!`)
  }, [counter, setCounter]);
  return (
    <div>
      <div>Hello</div>
      <button onClick={clickMeCB}>Click me {counter}</button>
      {states.map((state) => <State key={state.id} {...state.properties}></State>)}
    </div>
  )
}

export default App
