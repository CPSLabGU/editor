import CanvasSwitcherItem from '../canvas_switcher/CanvasSwitchItem'
import CanvasSwitcher from '../canvas_switcher/CanvasSwitcher'
import Machine from '../machines/Machine'
import { ItemDictionary } from '../canvas_switcher/CanvasSwitcher'
import MachineView from '../machines/MachineView'
import { v4 as uuidv4 } from 'uuid'
import Arrangement from '../arrangements/Arrangement'
import ArrangementView from '../arrangements/ArrangementView'

type ListData<T> = { [id: string]: T }

interface ConsoleMessage {
  id: string;
  timestamp: string;
  message: string;
  type: 'stdin' | 'stdout' | 'stderr';
}

export default class AppState {
  private _ids: { [url: string]: string }
  private _urls: { [id: string]: string }
  private _machines: ListData<Machine>
  private _arrangements: ListData<Arrangement>
  private _root: CanvasSwitcherItem | null
  private _selected: string | null
  private _expanded: ItemDictionary<boolean>
  private _consoleMessages: ConsoleMessage[];
  private _consoleVisible: boolean
  private _sidePanelVisible: boolean
  private _treeViewVisible: boolean
  private _allowConsoleTogglingVisibility: boolean
  private _allowSidePanelTogglingVisibility: boolean
  private _allowTreeViewTogglingVisibility: boolean
  private _theme: 'dark' | 'light';

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

  get consoleMessages(): ConsoleMessage[] {
    return this._consoleMessages
  }

  get consoleVisible(): boolean {
    return this._consoleVisible
  }

  get sidePanelVisible(): boolean {
    return this._sidePanelVisible
  }

  get treeViewVisible(): boolean {
    return this._treeViewVisible
  }

  get allowConsoleTogglingVisibility(): boolean {
    return this._allowConsoleTogglingVisibility
  }

  get allowSidePanelTogglingVisibility(): boolean {
    return this._allowSidePanelTogglingVisibility
  }

  get allowTreeViewTogglingVisiblity(): boolean {
    return this._allowTreeViewTogglingVisibility
  }

  get theme(): 'dark' | 'light' {
    return this._theme;
  }

  get selectedData(): [string, string, string] | undefined {
    const selectedID = this.selected
    if (!selectedID) return undefined
    const arrangement = this.arrangements[selectedID]
    if (arrangement) return [selectedID, JSON.stringify(arrangement.toModel), 'arrangement']
    const machine = this.machines[selectedID]
    if (!machine) return undefined
    const model = machine.toModel
    return [selectedID, JSON.stringify(model), 'machine']
  }

  get copy(): AppState {
    const newState = new AppState()
    newState._ids = { ...this._ids }
    newState._urls = { ...this._urls }
    newState._arrangements = { ...this._arrangements }
    newState._machines = { ...this._machines }
    newState._root = this._root
    newState._selected = this._selected
    newState._expanded = { ...this._expanded }
    newState._consoleMessages = [ ...this.consoleMessages ];
    newState._consoleVisible = this._consoleVisible
    newState._sidePanelVisible = this._sidePanelVisible
    newState._treeViewVisible = this._treeViewVisible
    newState._allowConsoleTogglingVisibility = this.allowConsoleTogglingVisibility
    newState._allowSidePanelTogglingVisibility = this._allowSidePanelTogglingVisibility
    newState._allowTreeViewTogglingVisibility = this._allowTreeViewTogglingVisibility
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
    this._consoleMessages = []
    this._consoleVisible = false
    this._sidePanelVisible = false
    this._treeViewVisible = false
    this._allowConsoleTogglingVisibility = false
    this._allowSidePanelTogglingVisibility = false
    this._allowTreeViewTogglingVisibility = false
    this._theme = 'light';
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

  loadRootArrangement(
    data: string,
    url: string,
  ): AppState {
    const arrangement = Arrangement.fromData(data)
    if (!arrangement) return this
    return this.setNewRootArrangement(arrangement, url)
  }

  loadRootMachine(data: string, url: string): AppState {
    const machine = Machine.fromData(data, this._theme)
    if (!machine) return this
    return this.setNewRootMachine(machine, url)
  }

  newRootArrangement(language: string): AppState {
    const arrangement = new Arrangement(language, {}, '', {}, '')
    return this.setNewRootArrangement(arrangement, null)
  }

  newRootMachine(): AppState {
    const machine = Machine.defaultMachine(this._theme);
    return this.setNewRootMachine(machine, null)
  }

  setArrangement(
    id: string,
    arrangement: Arrangement,
  ): AppState {
    const newState = this.copy
    newState._arrangements[id] = arrangement
    return newState
  }

  setArrangements(
    arrangements: ListData<Arrangement>,
  ): AppState {
    const newState = this.copy
    newState._arrangements = arrangements
    return newState
  }

  setNewRootArrangement(
    arrangement: Arrangement,
    url: string | null,
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
    newState._allowConsoleTogglingVisibility = true
    newState._allowSidePanelTogglingVisibility = false
    newState._allowTreeViewTogglingVisibility = true
    newState._consoleMessages = []
    newState._consoleVisible = false
    newState._sidePanelVisible = false
    newState._treeViewVisible = false
    newState._selected = id
    return newState
  }

  setNewRootMachine(
    machine: Machine,
    url: string | null,
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
    newState._allowConsoleTogglingVisibility = true
    newState._allowSidePanelTogglingVisibility = true
    newState._allowTreeViewTogglingVisibility = false
    newState._consoleMessages = []
    newState._consoleVisible = false
    newState._sidePanelVisible = false
    newState._treeViewVisible = false
    return newState
  }

  setMachine(id: string, machine: Machine): AppState {
    const newState = this.copy
    newState._machines[id] = machine
    return newState
  }

  setMachines(machines: ListData<Machine>): AppState {
    const newState = this.copy
    newState._machines = machines
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

  addConsoleMessage(newMessage: ConsoleMessage): AppState {
    const newState = this.copy
    newState._consoleMessages = [ ...this._consoleMessages, { ...newMessage } ];
    if (newState._consoleMessages.length > 1024) {
      newState._consoleMessages.splice(0, newState._consoleMessages.length - 1024);
    }
    return newState
  }

  setConsoleMessages(newMessages: ConsoleMessage[]): AppState {
    const newState = this.copy
    newState._consoleMessages = [ ...newMessages ];
    return newState
  }

  setConsoleVisible(visible: boolean): AppState {
    const newState = this.copy
    newState._consoleVisible = visible
    return newState
  }

  setSidePanelVisible(visible: boolean): AppState {
    const newState = this.copy
    newState._sidePanelVisible = visible
    return newState
  }

  setTreeViewVisible(visible: boolean): AppState {
    const newState = this.copy
    newState._treeViewVisible = visible
    return newState
  }

  setAllowConsoleTogglingVisibility(allow: boolean): AppState {
    const newState = this.copy
    newState._allowConsoleTogglingVisibility = allow
    return newState
  }

  setAllowSidePanelTogglingVisibility(allow: boolean): AppState {
    const newState = this.copy
    newState._allowSidePanelTogglingVisibility = allow
    return newState
  }

  setAllowTreeViewTogglingVisibility(allow: boolean): AppState {
    const newState = this.copy
    newState._allowTreeViewTogglingVisibility = allow
    return newState
  }

  setTheme(theme: 'dark' | 'light'): AppState {
    const newState = this.copy;
    newState._theme = theme;
    return newState;
  }

  url(id: string): string | undefined {
    return this._urls[id]
  }
}
