import VariableMapping from './VariableMapping'

export default class MachineReference {
  name: string
  path: string
  mappings: { [id: string]: VariableMapping }

  constructor(name: string, path: string, mappings: { [id: string]: VariableMapping }) {
    this.name = name
    this.path = path
    this.mappings = mappings
  }
}
