import StateModel, { instanceOfStateModel } from '../states/StateModel'
import TransitionModel, { instanceOfTransitionModel } from '../transitions/TransitionModel'
import ClockModel, { instanceOfClockModel } from '../clocks/ClockModel'

export default interface MachineModel {
  states: StateModel[]
  externalVariables: string
  machineVariables: string
  includes: string
  transitions: TransitionModel[]
  initialState: string
  suspendedState: string | undefined
  clocks: ClockModel[]
}

export function instanceOfMachineModel(obj: object): obj is MachineModel {
  return (
    'states' in obj &&
    'externalVariables' in obj &&
    'machineVariables' in obj &&
    'includes' in obj &&
    'transitions' in obj &&
    'initialState' in obj &&
    'clocks' in obj &&
    Array.isArray(obj.states) &&
    (obj.states as unknown[]).find(
      (element: unknown): boolean =>
        !(typeof element === 'object') || !instanceOfStateModel(element as object)
    ) === undefined &&
    typeof obj.externalVariables === 'string' &&
    typeof obj.machineVariables === 'string' &&
    typeof obj.includes === 'string' &&
    Array.isArray(obj.transitions) &&
    (obj.transitions as unknown[]).find(
      (element: unknown): boolean =>
        !(typeof element === 'object') || !instanceOfTransitionModel(element as object)
    ) === undefined &&
    typeof obj.initialState === 'string' &&
    (!('suspendState' in obj) || typeof obj.suspendedState === 'string') &&
    Array.isArray(obj.clocks) &&
    (obj.clocks as unknown[]).find(
      (element: unknown): boolean =>
        !(typeof element === 'object') || !instanceOfClockModel(element as ClockModel)
    ) === undefined
  )
}
