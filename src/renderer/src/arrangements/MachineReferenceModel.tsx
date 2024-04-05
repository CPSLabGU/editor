import VariableMappingModel, { instanceOfVariableMappingModel } from './VariableMappingModel'

export default interface MachineReferenceModel {
  name: string
  path: string
  mappings: VariableMappingModel[]
}

export function instanceOfMachineReferenceModel(obj: object): obj is MachineReferenceModel {
  return (
    'name' in obj &&
    'path' in obj &&
    'mappings' in obj &&
    typeof obj.name === 'string' &&
    typeof obj.path === 'string' &&
    Array.isArray(obj.mappings) &&
    (obj.mappings as unknown[]).find(
      (element: unknown): boolean =>
        !(typeof element === 'object') || !instanceOfVariableMappingModel(element as object)
    ) === undefined
  )
}
