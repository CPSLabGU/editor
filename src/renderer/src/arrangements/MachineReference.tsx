import MachineReferenceModel from './MachineReferenceModel'
import VariableMapping from './VariableMapping'
import { v4 as uuidv4 } from 'uuid'

export default class MachineReference {
  name: string
  path: string
  mappings: { [id: string]: VariableMapping }

  get toModel(): MachineReferenceModel {
    return {
      name: this.name,
      path: this.path,
      mappings: Object.values(this.mappings)
    }
  }

  constructor(name: string, path: string, mappings: { [id: string]: VariableMapping }) {
    this.name = name
    this.path = path
    this.mappings = mappings
  }

  static fromModel(model: MachineReferenceModel): MachineReference {
    return new MachineReference(
      model.name,
      model.path,
      model.mappings.reduce((mappings, mapping) => ({ ...mappings, [uuidv4()]: mapping }), {})
    )
  }
}
