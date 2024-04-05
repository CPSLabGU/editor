import BezierPath from './BezierPath'
import Clock from './Clock'
import MachineModel, { instanceOfMachineModel } from '../MachineModel/MachineModel'
import StateModel from '../MachineModel/StateModel'
import StateLayout from '../MachineModel/StateLayout'
import ActionModel from '../MachineModel/ActionModel'
import TransitionLayout from '../MachineModel/TransitionLayout'
import TransitionModel from '../MachineModel/TransitionModel'
import Point2D from './Point2D'
import StateInformation from './StateInformation'
import TransitionProperties from './TransitionProperties'
import { v4 as uuidv4 } from 'uuid'
import StateProperties from './StateProperties'
import ClockModel from '@renderer/MachineModel/ClockModel'

export default class Machine {
  states: { [id: string]: StateInformation }

  transitions: { [id: string]: TransitionProperties }

  externalVariables: string

  machineVariables: string

  includes: string

  initialState: string

  suspendedState: string | undefined

  clocks: Clock[]

  static get defaultMachine(): Machine {
    const initialStates: { [id: string]: StateInformation } = {}
    const initialTransitions: { [id: string]: TransitionProperties } = {}
    function addState(...states: StateInformation[]): void {
      for (let i = 0; i < states.length; i++) {
        initialStates[states[i].id] = states[i]
      }
    }
    addState(
      new StateInformation(
        uuidv4(),
        new StateProperties(
          'Initial',
          200,
          100,
          false,
          [],
          { OnEntry: '', OnExit: '', Internal: '' },
          '',
          ''
        ),
        new Point2D(0, 0)
      ),
      new StateInformation(
        uuidv4(),
        new StateProperties(
          'Suspended',
          200,
          100,
          false,
          [],
          { OnEntry: '', OnExit: '', Internal: '' },
          '',
          ''
        ),
        new Point2D(0, 200)
      )
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
    const machine = new Machine(
      initialStates,
      initialTransitions,
      '',
      '',
      '',
      initialState!,
      suspendedState,
      new Array<Clock>()
    )
    return machine
  }

  get toModel(): MachineModel {
    const models: { stateModel: StateModel; transitionModels: TransitionModel[] }[] = Object.keys(
      this.states
    ).map((id) => {
      const state = this.states[id]!
      const stateLayout: StateLayout = {
        position: state.position.toModel,
        dimensions: { x: state.properties.w, y: state.properties.h }
      }
      const actions: ActionModel[] = Object.keys(state.properties.actions).map((actionName) => {
        return {
          name: actionName,
          code: state.properties.actions[actionName] || ''
        }
      })
      const stateModel: StateModel = {
        name: state.properties.name,
        variables: state.properties.variables,
        externalVariables: state.properties.externalVariables,
        actions: actions.toSorted((a: ActionModel, b: ActionModel) => {
          return a.name < b.name ? -1 : 1
        }),
        layout: stateLayout
      }
      const transitionModels: TransitionModel[] = state.properties.transitions.flatMap(
        (transitionID) => {
          const stateTransition = this.transitions[transitionID]
          if (!stateTransition) return []
          const target = this.states[stateTransition.target]?.properties.name
          if (!target) return []
          const layout: TransitionLayout = {
            path: stateTransition.path.toModel
          }
          return [
            {
              source: state.properties.name,
              target: target,
              condition: stateTransition.condition,
              layout: layout
            }
          ]
        }
      )
      return { stateModel: stateModel, transitionModels: transitionModels }
    })
    const stateModels: StateModel[] = models.map((models) => {
      return models.stateModel
    })
    const transitionModels: TransitionModel[] = models.flatMap((models) => {
      return models.transitionModels
    })
    let initialState: string
    if (this.states[this.initialState]) {
      initialState = this.states[this.initialState]!.properties.name
    } else {
      const firstState = Object.values(this.states)[0].properties.name
      console.log('No initial state defined, choosing: ', firstState)
      initialState = firstState
    }
    const suspendedState = this.suspendedState
      ? this.states[this.suspendedState]?.properties.name
      : undefined
    return {
      states: stateModels,
      externalVariables: this.externalVariables,
      machineVariables: this.machineVariables,
      includes: this.includes,
      transitions: transitionModels,
      initialState: initialState,
      suspendedState: suspendedState,
      clocks: this.clocks.map((clock: Clock): ClockModel => clock.toModel)
    }
  }

  constructor(
    states: { [id: string]: StateInformation },
    transitions: { [id: string]: TransitionProperties },
    externalVariables: string,
    machineVariables: string,
    includes: string,
    initialState: string,
    suspendedState: string | undefined = undefined,
    clocks: Clock[]
  ) {
    this.states = states
    this.transitions = transitions
    this.externalVariables = externalVariables
    this.machineVariables = machineVariables
    this.includes = includes
    this.initialState = initialState
    this.suspendedState = suspendedState
    this.clocks = clocks
  }

  static fromData(data: string): Machine | null {
    const parsedModel = JSON.parse(data)
    if (!(typeof parsedModel === 'object')) return null
    if (!instanceOfMachineModel(parsedModel as object)) return null
    const model = parsedModel as MachineModel
    return Machine.fromModel(model)
  }

  static fromModel(model: MachineModel): Machine {
    const states: { [id: string]: StateInformation } = {}
    model.states.forEach((stateModel) => {
      const stateID = uuidv4()
      const actions: { [action: string]: string } = {}
      stateModel.actions.forEach((action) => {
        actions[action.name] = action.code
      })
      const stateProperties = StateProperties.fromModel(stateModel)
      const information = new StateInformation(
        stateID,
        stateProperties,
        Point2D.fromModel(stateModel.layout.position)
      )
      states[stateID] = information
    })
    const transitions: { [id: string]: TransitionProperties } = {}
    model.transitions.forEach((transitionModel) => {
      const id: string = uuidv4()
      const sourceID = Object.keys(states).find(
        (key) => states[key].properties.name == transitionModel.source
      )
      if (!sourceID) return
      const properties: TransitionProperties = new TransitionProperties(
        sourceID,
        Object.keys(states).find((key) => states[key].properties.name == transitionModel.target)!,
        transitionModel.condition,
        BezierPath.fromModel(transitionModel.layout.path),
        'white'
      )
      transitions[id] = properties
      states[sourceID].properties.transitions.push(id)
    })
    return new Machine(
      states,
      transitions,
      model.externalVariables,
      model.machineVariables,
      model.includes,
      model.initialState,
      model.suspendedState,
      model.clocks.map(Clock.fromModel)
    )
  }
}
