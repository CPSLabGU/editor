import CanvasSwitcherItem from './models/CanvasSwitchItem'
import CanvasSwitcher from './views/CanvasSwitcher'
import Machine from './models/Machine'
import { MachineModel, machineToModel, modelToMachine } from './models/MachineModel'
import { ItemDictionary } from './views/CanvasSwitcher'
import MachineView, { StateDictionary, TransitionDictionary } from './views/MachineView'
import { v4 as uuidv4 } from 'uuid'

type MachineData<T> = { [id: string]: T }

export default class AppState {
  _ids: { [url: string]: string }
  _urls: { [id: string]: string }
  _machineStates: MachineData<StateDictionary>
  _machineTransitions: MachineData<TransitionDictionary>
  _machineEdittingState: MachineData<string | undefined>
  _machines: MachineData<Machine>
  _root: CanvasSwitcherItem | null
  _selected: string | null
  _expanded: ItemDictionary<boolean>
  _sidePanelVisible: boolean
  _allowSidePanelTogglingVisibility: boolean

  get ids(): { [url: string]: string } {
    return this._ids
  }

  get urls(): { [id: string]: string } {
    return this._urls
  }

  get machineStates(): MachineData<StateDictionary> {
    return this._machineStates
  }

  get machineTransitions(): MachineData<TransitionDictionary> {
    return this._machineTransitions
  }

  get machineEdittingState(): MachineData<string | undefined> {
    return this._machineEdittingState
  }

  get machines(): MachineData<Machine> {
    return this._machines
  }

  get root(): CanvasSwitcherItem | null {
    return this._root
  }

  get selected(): string | null {
    return this._selected
  }

  get expanded(): ItemDictionary<boolean> {
    return this._expanded
  }

  get sidePanelVisible(): boolean {
    return this._sidePanelVisible
  }

  get allowSidePanelTogglingVisibility(): boolean {
    return this._allowSidePanelTogglingVisibility
  }

  canvasSwitcher(setAppState: (newState: AppState) => void): JSX.Element {
    return (
      <CanvasSwitcher
        item={this.root!}
        allowTogglingVisibilty={this.allowSidePanelTogglingVisibility}
        sidePanelVisible={this.sidePanelVisible}
        setSidePanelVisible={(visible: boolean) => setAppState(this.setSidePanelVisible(visible))}
        getSelected={() => this.selected}
        setSelected={(key: string) => setAppState(this.setSelected(key))}
        getExpanded={() => this.expanded}
        setExpanded={(dictionary: ItemDictionary<boolean>) =>
          setAppState(this.setExpanded(dictionary))
        }
      />
    )
  }

  get selectedMachineData(): string | undefined {
    const selectedMachine = this.selected
    if (!selectedMachine) return undefined
    const machine = this.machines[selectedMachine]
    const states = this.machineStates[selectedMachine]
    const transitions = this.machineTransitions[selectedMachine]
    if (!machine || !states || !transitions) return undefined
    const model = machineToModel(machine, states, transitions)
    return JSON.stringify(model)
  }

  get copy(): AppState {
    const newState = new AppState()
    newState._ids = { ...this._ids }
    newState._urls = { ...this._urls }
    newState._machineStates = { ...this._machineStates }
    newState._machineTransitions = { ...this._machineTransitions }
    newState._machineEdittingState = { ...this._machineEdittingState }
    newState._machines = { ...this._machines }
    newState._root = this._root
    newState._selected = this._selected
    newState._expanded = { ...this._expanded }
    newState._sidePanelVisible = this._sidePanelVisible
    newState._allowSidePanelTogglingVisibility = this._allowSidePanelTogglingVisibility
    return newState
  }

  constructor() {
    this._ids = {}
    this._urls = {}
    this._machineStates = {}
    this._machineTransitions = {}
    this._machineEdittingState = {}
    this._machines = {}
    this._root = null
    this._selected = null
    this._expanded = {}
    this._sidePanelVisible = false
    this._allowSidePanelTogglingVisibility = false
  }

  addID(id: string, url: string): AppState {
    const newState = this.copy
    newState._ids[url] = id
    newState._urls[id] = url
    return newState
  }

  id(url: string): string | undefined {
    return this._ids[url]
  }

  loadRootMachine(data: string, url: string, setAppState: (newState: AppState) => void): AppState {
    const model = MachineModel.fromData(data)
    const { machine, states, transitions } = modelToMachine(model)
    const id = this.id(url) || uuidv4()
    this._urls[id] = url
    this._ids[url] = id
    const newState = this.copy
    newState._machineStates[id] = states
    newState._machineTransitions[id] = transitions
    newState._machines[id] = machine
    newState._root = new CanvasSwitcherItem(id, 'machine', [], () => null)
    newState._selected = id
    newState._allowSidePanelTogglingVisibility = false
    newState._sidePanelVisible = false
    newState.updateMachineView(id, setAppState)
    return newState
  }

  machineView(id: string, setAppState: (newState: AppState) => void): JSX.Element {
    return (
      <MachineView
        states={this.machineStates[id]}
        setStates={(setter: (states: StateDictionary) => StateDictionary) => {
          const newMachineStates = { ...this.machineStates }
          newMachineStates[id] = setter(newMachineStates[id])
          setAppState(this.setMachineStates(newMachineStates, setAppState))
        }}
        transitions={this.machineTransitions[id]}
        setTransitions={(setter: (transition: TransitionDictionary) => TransitionDictionary) => {
          const newMachineTransitions = { ...this.machineTransitions }
          newMachineTransitions[id] = setter(newMachineTransitions[id])
          setAppState(this.setMachineTransitions(newMachineTransitions, setAppState))
        }}
        edittingState={this.machineEdittingState[id]}
        setEdittingState={(stateID: string | undefined) => {
          const newEdittingState = { ...this.machineEdittingState }
          newEdittingState[id] = stateID
          setAppState(this.setMachineEdittingState(newEdittingState, setAppState))
        }}
        machine={this.machines[id]}
        setMachine={(newMachine: Machine) => {
          const newMachines = { ...this.machines }
          newMachines[id] = newMachine
          setAppState(this.setMachines(newMachines, setAppState))
        }}
      />
    )
  }

  setStates(
    id: string,
    state: StateDictionary,
    setAppState: (newState: AppState) => void
  ): AppState {
    const newState = this.copy
    newState._machineStates[id] = state
    newState.updateMachineView(id, setAppState)
    return newState
  }

  setMachineStates(
    states: MachineData<StateDictionary>,
    setAppState: (newState: AppState) => void
  ): AppState {
    const newState = this.copy
    newState._machineStates = states
    newState.updateAllMachineViews(setAppState)
    return newState
  }

  setTransitions(
    id: string,
    transition: TransitionDictionary,
    setAppState: (newState: AppState) => void
  ): AppState {
    const newState = this.copy
    newState._machineTransitions[id] = transition
    newState.updateMachineView(id, setAppState)
    return newState
  }

  setMachineTransitions(
    transition: MachineData<TransitionDictionary>,
    setAppState: (newState: AppState) => void
  ): AppState {
    const newState = this.copy
    newState._machineTransitions = transition
    newState.updateAllMachineViews(setAppState)
    return newState
  }

  setEdittingState(
    id: string,
    stateID: string | undefined,
    setAppState: (newState: AppState) => void
  ): AppState {
    const newState = this.copy
    newState._machineEdittingState[id] = stateID
    newState.updateMachineView(id, setAppState)
    return newState
  }

  setMachineEdittingState(
    edittingState: MachineData<string | undefined>,
    setAppState: (newState: AppState) => void
  ): AppState {
    const newState = this.copy
    newState._machineEdittingState = edittingState
    newState.updateAllMachineViews(setAppState)
    return newState
  }

  setMachine(id: string, machine: Machine, setAppState: (newState: AppState) => void): AppState {
    const newState = this.copy
    newState._machines[id] = machine
    newState.updateMachineView(id, setAppState)
    return newState
  }

  setMachines(machines: MachineData<Machine>, setAppState: (newState: AppState) => void): AppState {
    const newState = this.copy
    newState._machines = machines
    newState.updateAllMachineViews(setAppState)
    return newState
  }

  setRoot(root: CanvasSwitcherItem | null): AppState {
    const newState = this.copy
    newState._root = root
    return newState
  }

  setSelected(selected: string | null): AppState {
    const newState = this.copy
    newState._selected = selected
    return newState
  }

  setExpanded(expanded: ItemDictionary<boolean>): AppState {
    const newState = this.copy
    newState._expanded = expanded
    return newState
  }

  setSidePanelVisible(visible: boolean): AppState {
    const newState = this.copy
    newState._sidePanelVisible = visible
    return newState
  }

  setAllowSidePanelTogglingVisibility(allow: boolean): AppState {
    const newState = this.copy
    newState._allowSidePanelTogglingVisibility = allow
    return newState
  }

  updateAllMachineViews(setAppState: (newAppState: AppState) => void): void {
    for (const id in this.machines) {
      this.updateMachineView(id, setAppState)
    }
  }

  updateMachineView(id: string, setAppState: (newAppState: AppState) => void): void {
    if (!this.machineStates[id] || !this.machineTransitions[id] || !this.machines[id]) {
      return
    }
    const machineView = (): JSX.Element => this.machineView(id, setAppState)
    const item = this.root?.findChild(id)
    if (!item) return
    if (this.root?.id == id) {
      const root = this.root
      const newRoot = new CanvasSwitcherItem(root.id, root.title, root.children, machineView)
      this._root = newRoot
    } else {
      const root = this.root as CanvasSwitcherItem
      const newRoot = new CanvasSwitcherItem(root.id, root.title, root.children, root.view)
      const newItem = new CanvasSwitcherItem(item.id, item.title, item.children, machineView)
      newRoot.replaceChild(id, newItem)
      this._root = newRoot
    }
  }

  url(id: string): string | undefined {
    return this._urls[id]
  }
}
