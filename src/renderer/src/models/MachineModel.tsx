import Machine from './Machine'
import Point2D from './Point2D'
import StateInformation from './StateInformation'
import TransitionProperties from './TransitionProperties'
import BezierPath from './BezierPath'

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
  constructor(
    states: StateModel[],
    externalVariables: string,
    machineVariables: string,
    includes: string,
    transitions: TransitionModel[]
  ) {
    this.states = states
    this.externalVariables = externalVariables
    this.machineVariables = machineVariables
    this.includes = includes
    this.transitions = transitions
  }
}

class StateModel {
  name: string
  variables: string
  actions: { [action: string]: string }
  layout: StateLayout
  constructor(
    name: string,
    variables: string,
    actions: { [action: string]: string },
    layout: StateLayout
  ) {
    this.name = name
    this.variables = variables
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

class MachineFileSystem {
  machine: MachineModel
  constructor(machine: MachineModel) {
    this.machine = machine
  }
}

function machineToFileSystem({
  machine,
  states,
  transitions
}: {
  machine: Machine
  states: { [id: string]: StateInformation }
  transitions: { [id: string]: TransitionProperties }
}): MachineFileSystem {
  const models: { stateModel: StateModel; transitionModels: TransitionModel[] }[] = Object.keys(
    states
  ).map((id) => {
    const state = states[id]!
    const stateLayout = new StateLayout(
      state.position,
      new Point2D(state.properties.w, state.properties.h)
    )
    const stateModel = new StateModel(
      state.properties.name,
      state.properties.variables,
      state.properties.actions,
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
  return {
    machine: {
      states: stateModels,
      externalVariables: machine.externalVariables,
      machineVariables: machine.machineVariables,
      includes: machine.includes,
      transitions: transitionModels
    }
  }
}

export default {
  MachineModel,
  StateModel,
  TransitionModel,
  StateLayout,
  TransitionLayout,
  MachineFileSystem,
  machineToFileSystem
}
