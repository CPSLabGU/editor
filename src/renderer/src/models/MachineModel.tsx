import Machine from './Machine'
import Point2D from './Point2D'
import StateInformation from './StateInformation'
import TransitionProperties from './TransitionProperties'
import BezierPath from './BezierPath'
import Clock from './Clock'
import { v4 as uuidv4 } from 'uuid'

class StateLayout {
  position: Point2D
  dimensions: Point2D
  constructor(position: Point2D, dimensions: Point2D) {
    this.position = position
    this.dimensions = dimensions
  }
}

class TransitionLayout {
  path: BezierPath
  constructor(path: BezierPath) {
    this.path = path
  }
}

class MachineModel {
  states: StateModel[]
  externalVariables: string
  machineVariables: string
  includes: string
  transitions: TransitionModel[]
  initialState: string
  suspendedState: string | undefined
  clocks: Clock[]
  constructor(
    states: StateModel[],
    externalVariables: string,
    machineVariables: string,
    includes: string,
    transitions: TransitionModel[],
    initialState: string,
    suspendedState: string | undefined = undefined,
    clocks: Clock[]
  ) {
    this.states = states
    this.externalVariables = externalVariables
    this.machineVariables = machineVariables
    this.includes = includes
    this.transitions = transitions
    this.initialState = initialState
    this.suspendedState = suspendedState
    this.clocks = clocks
  }
}

class StateModel {
  name: string
  variables: string
  externalVariables: string
  actions: ActionModel[]
  layout: StateLayout
  constructor(
    name: string,
    variables: string,
    externalVariables: string,
    actions: ActionModel[],
    layout: StateLayout
  ) {
    this.name = name
    this.variables = variables
    this.externalVariables = externalVariables
    this.actions = actions
    this.layout = layout
  }
}

class TransitionModel {
  source: string
  target: string
  condition: string
  layout: TransitionLayout
  constructor(source: string, target: string, condition: string, layout: TransitionLayout) {
    this.source = source
    this.target = target
    this.condition = condition
    this.layout = layout
  }
}

class ActionModel {
  name: string
  code: string
  constructor(name: string, code: string) {
    this.name = name
    this.code = code
  }
}

function machineToModel(
  machine: Machine,
  states: { [id: string]: StateInformation },
  transitions: { [id: string]: TransitionProperties }
): MachineModel {
  const models: { stateModel: StateModel; transitionModels: TransitionModel[] }[] = Object.keys(
    states
  ).map((id) => {
    const state = states[id]!
    const stateLayout = new StateLayout(
      state.position,
      new Point2D(state.properties.w, state.properties.h)
    )
    const actions = Object.keys(state.properties.actions).map((actionName) => {
      return new ActionModel(actionName, state.properties.actions[actionName]!)
    })
    const stateModel = new StateModel(
      state.properties.name,
      state.properties.variables,
      state.properties.externalVariables,
      actions.toSorted((a: ActionModel, b: ActionModel) => {
        return a.name < b.name ? -1 : 1
      }),
      stateLayout
    )
    const transitionModels = state.properties.transitions.map((transitionID) => {
      const stateTransition = transitions[transitionID]!
      return new TransitionModel(
        state.properties.name,
        states[stateTransition.target]!.properties.name,
        stateTransition.condition,
        { path: stateTransition.path }
      )
    })
    return { stateModel: stateModel, transitionModels: transitionModels }
  })
  const stateModels: StateModel[] = models.map((models) => {
    return models.stateModel
  })
  const transitionModels: TransitionModel[] = models.flatMap((models) => {
    return models.transitionModels
  })
  let initialState: string
  if (states[machine.initialState]) {
    initialState = states[machine.initialState]!.properties.name
  } else {
    const firstState = Object.values(states)[0].properties.name
    console.log('No initial state defined, choosing: ', firstState)
    initialState = firstState
  }
  const suspendedState = machine.suspendedState
    ? states[machine.suspendedState]!.properties.name
    : undefined
  return {
    states: stateModels,
    externalVariables: machine.externalVariables,
    machineVariables: machine.machineVariables,
    includes: machine.includes,
    transitions: transitionModels,
    initialState: initialState,
    suspendedState: suspendedState,
    clocks: machine.clocks
  }
}

function modelToMachine(model: MachineModel): {
  machine: Machine
  states: { [id: string]: StateInformation }
  transitions: { [id: string]: TransitionProperties }
} {
  const states: { [id: string]: StateInformation } = {}
  const transitions: { [id: string]: TransitionProperties } = {}
  model.states.forEach((stateModel) => {
    const stateID = uuidv4()
    const actions: { [action: string]: string } = {}
    stateModel.actions.forEach((action) => {
      actions[action.name] = action.code
    })
    const stateProperties = {
      name: stateModel.name,
      w: stateModel.layout.dimensions.x,
      h: stateModel.layout.dimensions.y,
      expanded: false,
      transitions: [],
      actions: actions,
      variables: stateModel.variables,
      externalVariables: stateModel.externalVariables
    }
    const information = {
      id: stateID,
      properties: stateProperties,
      position: stateModel.layout.position
    }
    states[stateID] = information
  })
  model.transitions.forEach((transitionModel) => {
    const id: string = uuidv4()
    const sourceID = Object.keys(states).find(
      (key) => states[key].properties.name == transitionModel.source
    )!
    const properties = {
      source: sourceID,
      target: Object.keys(states).find(
        (key) => states[key].properties.name == transitionModel.target
      )!,
      condition: transitionModel.condition,
      path: transitionModel.layout.path,
      color: 'black'
    }
    transitions[id] = properties
    states[sourceID].properties.transitions.push(id)
  })
  const machine = {
    externalVariables: model.externalVariables,
    machineVariables: model.machineVariables,
    includes: model.includes,
    initialState: Object.keys(states).find(
      (id) => states[id].properties.name == model.initialState
    )!,
    suspendedState: Object.keys(states).find(
      (id) => states[id].properties.name == model.suspendedState
    ),
    clocks: model.clocks
  }
  return {
    machine: machine,
    states: states,
    transitions: transitions
  }
}

export {
  MachineModel,
  StateModel,
  TransitionModel,
  StateLayout,
  TransitionLayout,
  ActionModel,
  machineToModel,
  modelToMachine
}
