import StateModel from '@renderer/MachineModel/StateModel'

export default class StateProperties {
  name: string
  w: number
  h: number
  expanded: boolean
  transitions: string[]
  actions: { [action: string]: string }
  variables: string
  externalVariables: string

  constructor(
    name: string,
    w: number,
    h: number,
    expanded: boolean,
    transitions: string[],
    actions: { [action: string]: string },
    variables: string,
    externalVariables: string
  ) {
    this.name = name
    this.w = w
    this.h = h
    this.expanded = expanded
    this.transitions = transitions
    this.actions = actions
    this.variables = variables
    this.externalVariables = externalVariables
  }

  static fromModel(
    model: StateModel,
    expanded: boolean = false,
    transitions: string[] = []
  ): StateProperties {
    const actions: { [action: string]: string } = {}
    model.actions.forEach((action) => {
      actions[action.name] = action.code
    })
    return new StateProperties(
      model.name,
      model.layout.dimensions.x,
      model.layout.dimensions.y,
      expanded,
      transitions,
      actions,
      model.variables,
      model.externalVariables
    )
  }
}
