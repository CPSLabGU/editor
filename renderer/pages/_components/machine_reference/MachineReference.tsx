import MachineReferenceModel from './MachineReferenceModel'
import VariableMapping from '../variable_mapping/VariableMapping'
import { v4 as uuidv4 } from 'uuid'

export default class MachineReference {
  name: string
  path: string
  mappings: { [id: string]: VariableMapping }

  get emptyMapping(): [id: string, mapping: VariableMapping] {
    return [uuidv4(), new VariableMapping('', '')]
  }

  get toModel(): MachineReferenceModel {
    return {
      name: this.name,
      path: this.path,
      mappings: Object.values(this.mappings)
    }
  }

  get shallowCopy(): MachineReference {
    return new MachineReference(this.name, this.path, { ...this.mappings })
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

  addMapping(id: string, mapping: VariableMapping): MachineReference {
    const newReference = this.shallowCopy
    newReference.mappings[id] = mapping
    return newReference
  }

  removeMapping(id: string): MachineReference {
    const newReference = this.shallowCopy
    delete newReference.mappings[id]
    return newReference
  }
}
