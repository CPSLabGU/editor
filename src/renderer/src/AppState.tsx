import CanvasSwitcherItem from './models/CanvasSwitchItem'
import CanvasSwitcher from './views/CanvasSwitcher'
import Machine from './models/Machine'
import { ItemDictionary } from './views/CanvasSwitcher'
import MachineView from './views/MachineView'
import { v4 as uuidv4 } from 'uuid'
import Arrangement from './models/Arrangement'
import ArrangementView from './views/ArrangementView'

type ListData<T> = { [id: string]: T }

export default class AppState {
  private _ids: { [url: string]: string }
  private _urls: { [id: string]: string }
  private _machines: ListData<Machine>
  private _arrangements: ListData<Arrangement>
  private _root: CanvasSwitcherItem | null
  private _selected: string | null
  private _expanded: ItemDictionary<boolean>
  private _sidePanelVisible: boolean
  private _allowSidePanelTogglingVisibility: boolean

  get ids(): { [url: string]: string } {
    return this._ids
  }

  get urls(): { [id: string]: string } {
    return this._urls
  }

  get machines(): ListData<Machine> {
    return this._machines
  }

  get arrangements(): ListData<Arrangement> {
    return this._arrangements
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

  get selectedData(): [string, string] | undefined {
    const selectedID = this.selected
    if (!selectedID) return undefined
    const arrangement = this.arrangements[selectedID]
    if (arrangement) return [JSON.stringify(arrangement.toModel), 'arrangement']
    const machine = this.machines[selectedID]
    if (!machine) return undefined
    const model = machine.toModel
    return [JSON.stringify(model), 'machine']
  }

  get copy(): AppState {
    const newState = new AppState()
    newState._ids = { ...this._ids }
    newState._urls = { ...this._urls }
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
    this._machines = {}
    this._arrangements = {}
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

  arrangementView(id: string, setAppState: (newState: AppState) => void): JSX.Element {
    const arrangement = this.arrangements[id]
    if (!arrangement) return <div></div>
    return (
      <ArrangementView
        arrangement={this.arrangements[id]}
        setArrangement={(newArrangement: Arrangement) =>
          setAppState(this.setArrangement(id, newArrangement, setAppState))
        }
      />
    )
  }

  id(url: string): string | undefined {
    return this._ids[url]
  }

  loadRootArrangement(
    data: string,
    url: string,
    setAppState: (newState: AppState) => void
  ): AppState {
    const arrangement = Arrangement.fromData(data)
    if (!arrangement) return this
    return this.setNewRootArrangement(arrangement, url, setAppState)
  }

  loadRootMachine(data: string, url: string, setAppState: (newState: AppState) => void): AppState {
    const machine = Machine.fromData(data)
    if (!machine) return this
    return this.setNewRootMachine(machine, url, setAppState)
  }

  machineView(id: string, setAppState: (newState: AppState) => void): JSX.Element {
    const machine = this.machines[id]
    if (!machine) return <div></div>
    return (
      <MachineView
        machine={machine}
        setMachine={(newMachine: Machine) => {
          setAppState(this.setMachine(id, newMachine, setAppState))
        }}
      />
    )
  }

  newRootArrangement(language: string, setAppState: (newState: AppState) => void): AppState {
    const arrangement = new Arrangement(language, {}, '', {}, '')
    return this.setNewRootArrangement(arrangement, null, setAppState)
  }

  newRootMachine(setAppState: (newState: AppState) => void): AppState {
    const machine = Machine.defaultMachine
    return this.setNewRootMachine(machine, null, setAppState)
  }

  setArrangement(
    id: string,
    arrangement: Arrangement,
    setAppState: (newState: AppState) => void
  ): AppState {
    const newState = this.copy
    newState._arrangements[id] = arrangement
    newState.updateArrangementView(id, setAppState)
    return newState
  }

  setArrangements(
    arrangements: ListData<Arrangement>,
    setAppState: (newState: AppState) => void
  ): AppState {
    const newState = this.copy
    newState._arrangements = arrangements
    newState.updateAllArrangementViews(setAppState)
    return newState
  }

  setNewRootArrangement(
    arrangement: Arrangement,
    url: string | null,
    setAppState: (newState: AppState) => void
  ): AppState {
    const newState = new AppState()
    const id = uuidv4()
    if (url) {
      newState._ids[url] = id
      newState._urls[id] = url
    }
    const machineItems: CanvasSwitcherItem[] = []
    for (const id in arrangement.machines) {
      const machine = arrangement.machines[id]
      machineItems.push(new CanvasSwitcherItem(id, machine.name, [], () => null))
      newState._ids[machine.path] = id
      newState._urls[id] = machine.path
    }
    newState._arrangements[id] = arrangement
    newState._root = new CanvasSwitcherItem(
      id,
      url?.split('/').pop()?.replace('.arrangement', '') || 'arrangement',
      machineItems,
      () => null
    )
    newState._allowSidePanelTogglingVisibility = true
    newState._sidePanelVisible = true
    newState._selected = id
    newState.updateArrangementView(id, setAppState)
    return newState
  }

  setNewRootMachine(
    machine: Machine,
    url: string | null,
    setAppState: (newState: AppState) => void
  ): AppState {
    const id = uuidv4()
    const newState = new AppState()
    if (url) {
      newState._urls[id] = url
      newState._ids[url] = id
    }
    newState._machines[id] = machine
    newState._root = new CanvasSwitcherItem(
      id,
      url?.split('/').pop()?.replace('.machine', '') || 'machine',
      [],
      () => null
    )
    newState._selected = id
    newState._allowSidePanelTogglingVisibility = false
    newState._sidePanelVisible = false
    newState.updateMachineView(id, setAppState)
    return newState
  }

  setMachine(id: string, machine: Machine, setAppState: (newState: AppState) => void): AppState {
    const newState = this.copy
    newState._machines[id] = machine
    newState.updateMachineView(id, setAppState)
    return newState
  }

  setMachines(machines: ListData<Machine>, setAppState: (newState: AppState) => void): AppState {
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

  updateAllArrangementViews(setAppState: (newAppState: AppState) => void): void {
    for (const id in this.arrangements) {
      this.updateArrangementView(id, setAppState)
    }
  }

  updateAllMachineViews(setAppState: (newAppState: AppState) => void): void {
    for (const id in this.machines) {
      this.updateMachineView(id, setAppState)
    }
  }

  updateArrangementView(id: string, setAppState: (newAppState: AppState) => void): void {
    const item = this.root?.findChild(id)
    if (!item) return
    const arrangement = this.arrangements[id]
    const arrangementView = arrangement
      ? (): JSX.Element => this.arrangementView(id, setAppState)
      : (): JSX.Element => <div></div>
    if (this.root?.id == id) {
      const root = this.root
      const newRoot = new CanvasSwitcherItem(root.id, root.title, root.children, arrangementView)
      this._root = newRoot
    } else {
      const root = this.root as CanvasSwitcherItem
      const newRoot = new CanvasSwitcherItem(root.id, root.title, root.children, root.view)
      const newItem = new CanvasSwitcherItem(item.id, item.title, item.children, arrangementView)
      newRoot.replaceChild(id, newItem)
      this._root = newRoot
    }
  }

  updateMachineView(id: string, setAppState: (newAppState: AppState) => void): void {
    const machine = this.machines[id]
    if (!machine) return
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
