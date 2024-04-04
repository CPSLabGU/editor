import Clock from './Clock'
import MachineReferenceModel from './MachineReferenceModel'

export default interface ArrangementModel {
  clocks: Clock[]
  externalVariables: string
  machines: MachineReferenceModel[]
  globalVariables: string
}
