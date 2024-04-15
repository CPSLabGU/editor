import ArrangementModel, { instanceOfArrangementModel } from './ArrangementModel'
import Clock from '../clocks/Clock'
import MachineReference from '../machine_reference/MachineReference'
import { v4 as uuidv4 } from 'uuid'
import MachineReferenceModel from '../machine_reference/MachineReferenceModel'

export default class Arrangement {
  private _language: string
  private _clocks: { [id: string]: Clock }
  private _externalVariables: string
  private _machines: { [id: string]: MachineReference }
  private _globalVariables: string

  get language(): string {
    return this._language
  }

  get clocks(): { [id: string]: Clock } {
    return this._clocks
  }

  get externalVariables(): string {
    return this._externalVariables
  }

  get machines(): { [id: string]: MachineReference } {
    return this._machines
  }

  get globalVariables(): string {
    return this._globalVariables
  }

  get emptyClock(): [id: string, clock: Clock] {
    return [uuidv4(), new Clock('', '')]
  }

  get emptyMachine(): [id: string, machine: MachineReference] {
    return [uuidv4(), new MachineReference('', '', {})]
  }

  get shallowCopy(): Arrangement {
    return new Arrangement(
      this.language,
      { ...this.clocks },
      this.externalVariables,
      { ...this.machines },
      this.globalVariables
    )
  }

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
    this._language = language
    this._clocks = clocks
    this._externalVariables = externalVariables
    this._machines = machines
    this._globalVariables = globalVariables
  }

  static fromData(data: string): Arrangement | null {
    const json = JSON.parse(data)
    console.log(json)
    if (!(typeof json === 'object')) return null
    if (!instanceOfArrangementModel(json as object)) return null
    const model = json as ArrangementModel
    return Arrangement.fromModel(model)
  }

  static fromModel(model: ArrangementModel): Arrangement {
    return new Arrangement(
      'vhdl',
      model.clocks
        .map(Clock.fromModel)
        .reduce((clocks, clock) => ({ ...clocks, [uuidv4()]: clock }), {}),
      model.externalVariables,
      model.machines.reduce(
        (machines, machine) => ({ ...machines, [uuidv4()]: MachineReference.fromModel(machine) }),
        {}
      ),
      model.globalVariables
    )
  }

  addClock(clock: Clock): Arrangement {
    const newArrangement = this.shallowCopy
    const id = uuidv4()
    newArrangement._clocks[id] = clock
    return newArrangement
  }

  addMachine(machine: MachineReference): Arrangement {
    const newArrangement = this.shallowCopy
    const id = uuidv4()
    newArrangement._machines[id] = machine
    return newArrangement
  }

  deleteClock(id: string): Arrangement {
    const newArrangement = this.shallowCopy
    delete newArrangement._clocks[id]
    return newArrangement
  }

  deleteMachine(id: string): Arrangement {
    const newArrangement = this.shallowCopy
    delete newArrangement._machines[id]
    return newArrangement
  }

  setLanguage(language: string): Arrangement {
    const newArrangement = this.shallowCopy
    newArrangement._language = language
    return newArrangement
  }

  setClocks(clocks: { [id: string]: Clock }): Arrangement {
    const newArrangement = this.shallowCopy
    newArrangement._clocks = clocks
    return newArrangement
  }

  setClock(id: string, clock: Clock): Arrangement {
    const newArrangement = this.shallowCopy
    newArrangement._clocks[id] = clock
    return newArrangement
  }

  setExternalVariables(externalVariables: string): Arrangement {
    const newArrangement = this.shallowCopy
    newArrangement._externalVariables = externalVariables
    return newArrangement
  }

  setMachines(machines: { [id: string]: MachineReference }): Arrangement {
    const newArrangement = this.shallowCopy
    newArrangement._machines = machines
    return newArrangement
  }

  setMachine(id: string, machine: MachineReference): Arrangement {
    const newArrangement = this.shallowCopy
    newArrangement._machines[id] = machine
    return newArrangement
  }

  setGlobalVariables(globalVariables: string): Arrangement {
    const newArrangement = this.shallowCopy
    newArrangement._globalVariables = globalVariables
    return newArrangement
  }
}
