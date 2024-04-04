import BezierPath from './BezierPath'
import Clock from './Clock'
import Point2D from './Point2D'
import StateInformation from './StateInformation'
import TransitionProperties from './TransitionProperties'
import { v4 as uuidv4 } from 'uuid'

export default class Machine {
  externalVariables: string

  machineVariables: string

  includes: string

  initialState: string

  suspendedState: string | undefined

  clocks: Clock[]

  static get defaultMachine(): [
    { [id: string]: StateInformation },
    { [id: string]: TransitionProperties },
    Machine
  ] {
    const initialStates: { [id: string]: StateInformation } = {}
    const initialTransitions: { [id: string]: TransitionProperties } = {}
    function addState(...states: StateInformation[]): void {
      for (let i = 0; i < states.length; i++) {
        initialStates[states[i].id] = states[i]
      }
    }
    addState(
      {
        id: uuidv4(),
        properties: {
          name: 'Initial',
          w: 200,
          h: 100,
          expanded: false,
          transitions: [],
          actions: { OnEntry: '', OnExit: '', Internal: '' },
          variables: '',
          externalVariables: ''
        },
        position: new Point2D(0, 0)
      },
      {
        id: uuidv4(),
        properties: {
          name: 'Suspended',
          w: 200,
          h: 100,
          expanded: false,
          transitions: [],
          actions: { OnEntry: '', OnExit: '', Internal: '' },
          variables: '',
          externalVariables: ''
        },
        position: new Point2D(0, 200)
      }
    )
    const initialState = Object.keys(initialStates).find(
      (id) => initialStates[id].properties.name == 'Initial'
    )
    const suspendedState = Object.keys(initialStates).find(
      (id) => initialStates[id].properties.name == 'Suspended'
    )
    // Create default transitions.
    const newUUID = uuidv4()
    initialTransitions[newUUID] = new TransitionProperties(
      initialState!,
      suspendedState!,
      'true',
      new BezierPath(
        new Point2D(100, 100),
        new Point2D(100, 200),
        new Point2D(100, 135),
        new Point2D(100, 170)
      ),
      'white'
    )
    initialStates[initialState!].properties.transitions = [newUUID]
    const machine = new Machine('', '', '', initialState!, suspendedState, new Array<Clock>())
    return [initialStates, initialTransitions, machine]
  }

  constructor(
    externalVariables: string,
    machineVariables: string,
    includes: string,
    initialState: string,
    suspendedState: string | undefined = undefined,
    clocks: Clock[]
  ) {
    this.externalVariables = externalVariables
    this.machineVariables = machineVariables
    this.includes = includes
    this.initialState = initialState
    this.suspendedState = suspendedState
    this.clocks = clocks
  }
}
