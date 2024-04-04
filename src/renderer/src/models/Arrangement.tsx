import Clock from './Clock'
import MachineReference from './MachineReference'

export default class Arrangement {
  clocks: Clock[]
  externalVariables: string
  machines: MachineReference[]
  globalVariables: string

  constructor(
    clocks: Clock[],
    externalVariables: string,
    machines: MachineReference[],
    globalVariables: string
  ) {
    this.clocks = clocks
    this.externalVariables = externalVariables
    this.machines = machines
    this.globalVariables = globalVariables
  }
}
