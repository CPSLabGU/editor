import Clock from './Clock'
import MachineReference from './MachineReference'

export default class Arrangement {
  language: string
  clocks: { [id: string]: Clock }
  externalVariables: string
  machines: { [id: string]: MachineReference }
  globalVariables: string

  constructor(
    language: string,
    clocks: { [id: string]: Clock },
    externalVariables: string,
    machines: { [id: string]: MachineReference },
    globalVariables: string
  ) {
    this.language = language
    this.clocks = clocks
    this.externalVariables = externalVariables
    this.machines = machines
    this.globalVariables = globalVariables
  }
}
