export default class MachineModel {
  states: StateModel[]
  externalVariables: string
  machineVariables: string
  includes: string
  transitions: TransitionModel[]
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
}
