import { useCallback, useState } from 'react'
import './App.css'
import State from './State'

function App() {
  const [counter, setCounter] = useState(0);
  const clickMeCB = useCallback(() => {
    setCounter(counter + 1);
    console.log(`clicked me ${counter} times!`)
  }, [counter, setCounter]);
  return (
    <div>
      <div>Hello</div>
      <button onClick={clickMeCB}>Click me {counter}</button>
      <State properties={{name: "State0", w: 100, h: 100}} expanded={false}></State>
    </div>
  )
}

export default App
