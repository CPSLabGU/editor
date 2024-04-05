import ClockModel, { instanceOfClockModel } from './ClockModel'
import MachineReferenceModel, { instanceOfMachineReferenceModel } from './MachineReferenceModel'

export default interface ArrangementModel {
  clocks: ClockModel[]
  externalVariables: string
  machines: MachineReferenceModel[]
  globalVariables: string
}

export function instanceOfArrangementModel(obj: object): obj is ArrangementModel {
  return (
    'clocks' in obj &&
    'externalVariables' in obj &&
    'machines' in obj &&
    'globalVariables' in obj &&
    Array.isArray(obj.clocks) &&
    (obj.clocks as unknown[]).find(
      (element: unknown): boolean =>
        !(typeof element === 'object') || !instanceOfClockModel(element as object)
    ) === undefined &&
    typeof obj.externalVariables === 'string' &&
    Array.isArray(obj.machines) &&
    (obj.machines as unknown[]).find(
      (element: unknown): boolean =>
        !(typeof element === 'object') || !instanceOfMachineReferenceModel(element as object)
    ) === undefined &&
    typeof obj.globalVariables === 'string'
  )
}
