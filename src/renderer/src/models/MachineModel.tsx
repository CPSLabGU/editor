import Point2D from "./Point2D"

export default class MachineModel {
  states: StateModel[]
  externalVariables: string
  machineVariables: string
  includes: string
  transitions: TransitionModel[]
  constructor(states: StateModel[], externalVariables: string, machineVariables: string, includes: string, transitions: TransitionModel[]) {
    this.states = states
    this.externalVariables = externalVariables
    this.machineVariables = machineVariables
    this.includes = includes
    this.transitions = transitions
  }
}

export default class StateModel {
  name: string
  variables: string
  actions: { [action: string]: string }
  constructor(name: string, variables: string, actions: { [action: string]: string }) {
    this.name = name
    this.variables = variables
    this.actions = actions
  }
}

export default class TransitionModel {
  source: string
  target: string
  condition: string
  constructor(source: string, target: string, condition: string) {
    this.source = source
    this.target = target
    this.condition = condition
  }
}

export default class MachineLayout {
  stateLayouts: StateLayout[]
  transitionLayouts: TransitionLayout[]
  constructor(stateLayouts: StateLayout[], transitionLayouts: TransitionLayout[]) {
    this.stateLayouts = stateLayouts
    this.transitionLayouts = transitionLayouts
  }
}

export default class StateLayout {
  position: Point2D
  dimensions: Point2D
  constructor(position: Point2D, dimensions: Point2D) {
    this.position = position
    this.dimensions = dimensions
  }
}

export default class TransitionLayout {

  path: BezierPath
  constructor(path: BezierPath) {
    this.path = path
  }

}
