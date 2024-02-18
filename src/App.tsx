import StateInformation from "./models/StateInformation";
import TransitionProperties from "./models/TransitionProperties";
import Point2D from "./models/Point2D";
import BezierPath from "./models/BezierPath";
import { v4 as uuidv4 } from "uuid";
import Canvas from "./views/Canvas";
import { useState } from "react";
import './App.css';
import CodeView from "./views/CodeView";

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
      transitions: [],
      actions: { "onEntry": "", "onExit": "", "Internal": ""}
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
      transitions: [],
      actions: { "onEntry": "", "onExit": "", "Internal": ""}
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

export default function App() {
  // const [counter, setCounter] = useState(0);
  const [states, setStates] = useState(initialStates);
  const [transitions, setTransitions] = useState(initialTransitions);
  const [edittingState, setEdittingState] = useState<string | undefined>(undefined);
  if (edittingState !== undefined) {
    return (
      <CodeView actions={states[edittingState].properties.actions} language="javascript" state={states[edittingState].properties.name} setActions={(action: string, code: string) => { states[edittingState].properties.actions[action] = code; }} onExit={() => setEdittingState(undefined)} />
    );
  } else {
    return (
      <Canvas states={states} transitions={transitions} setStates={setStates} setTransitions={setTransitions} setEdittingState={setEdittingState} />
    );
  }
}