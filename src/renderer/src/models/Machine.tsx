export default class Machine {
  externalVariables: string

  machineVariables: string

  includes: string

  initialState: string

  suspendedState: string | undefined

  constructor(
    externalVariables: string,
    machineVariables: string,
    includes: string,
    initialState: string,
    suspendedState: string | undefined = undefined
  ) {
    this.externalVariables = externalVariables
    this.machineVariables = machineVariables
    this.includes = includes
    this.initialState = initialState
    this.suspendedState = suspendedState
  }
}
