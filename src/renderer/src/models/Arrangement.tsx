import ArrangementModel from './ArrangementModel'
import Clock from './Clock'
import MachineReference from './MachineReference'
import { v4 as uuidv4 } from 'uuid'
import MachineReferenceModel from './MachineReferenceModel'

export default class Arrangement {
  language: string
  clocks: { [id: string]: Clock }
  externalVariables: string
  machines: { [id: string]: MachineReference }
  globalVariables: string

  get toModel(): ArrangementModel {
    return {
      clocks: Object.values(this.clocks),
      externalVariables: this.externalVariables,
      machines: Object.values(this.machines).map(
        (machine: MachineReference): MachineReferenceModel => machine.toModel
      ),
      globalVariables: this.globalVariables
    }
  }

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

  static fromData(data: string): Arrangement | null {
    function instanceOfArrangementModel(json: object): json is ArrangementModel {
      return (
        'clocks' in json &&
        'externalVariables' in json &&
        'machines' in json &&
        'globalVariables' in json &&
        Array.isArray(json.clocks) &&
        Array.isArray(json.machines)
      )
    }
    const json = JSON.parse(data)
    console.log(json)
    if (!instanceOfArrangementModel(json)) return null
    const model = json as ArrangementModel
    return Arrangement.fromModel(model)
  }

  static fromModel(model: ArrangementModel): Arrangement {
    return new Arrangement(
      'vhdl',
      model.clocks.reduce((clocks, clock) => ({ ...clocks, [uuidv4()]: clock }), {}),
      model.externalVariables,
      model.machines.reduce(
        (machines, machine) => ({ ...machines, [uuidv4()]: MachineReference.fromModel(machine) }),
        {}
      ),
      model.globalVariables
    )
  }
}
