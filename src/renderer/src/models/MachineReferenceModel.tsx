import VariableMapping from './VariableMapping'

export default interface MachineReferenceModel {
  name: string
  path: string
  mappings: VariableMapping[]
}
