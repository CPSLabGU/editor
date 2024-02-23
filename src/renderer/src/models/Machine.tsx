import Clock from './Clock'

export default class Machine {
  externalVariables: string

  machineVariables: string

  includes: string

  initialState: string

  suspendedState: string | undefined

  clocks: Clock[]

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
