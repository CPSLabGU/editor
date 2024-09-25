import CanvasSwitcherItem from './CanvasSwitchItem'
import LoadingView from '../util/LoadingView'
import TreeView from '../treeview/TreeView'
import TreeViewItem from '../treeview/TreeViewItem'
import HiddenView from '../util/HiddenView'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

export type ItemDictionary<T> = { [key: string]: T }

interface CanvasSwitcherArgs {
  item: CanvasSwitcherItem
  allowTogglingVisibilty: boolean
  sidePanelVisible: boolean
  setSidePanelVisible: (visible: boolean) => void
  getSelected: () => string | null
  setSelected: (key: string) => void
  getExpanded: () => ItemDictionary<boolean>
  setExpanded: (dictionary: ItemDictionary<boolean>) => void
}

export default function CanvasSwitcher({
  item,
  allowTogglingVisibilty,
  sidePanelVisible,
  setSidePanelVisible,
  getSelected,
  setSelected,
  getExpanded,
  setExpanded
}: CanvasSwitcherArgs): JSX.Element {
  const treeItem: TreeViewItem = item.treeViewItem(
    (key: string) => getSelected() === key,
    (key: string) => setSelected(key),
    (key: string) => getExpanded()[key] === true,
    (key: string, expanded: boolean) => setExpanded({ ...getExpanded(), [key]: expanded })
  )
  const selectedKey = getSelected()
  const selectedView: (() => JSX.Element | null) | undefined =
    selectedKey !== null ? item.findChild(selectedKey)?.view : undefined
  return (
    <div className="w-full h-full">
      <HiddenView hidden={sidePanelVisible}>
        <HiddenView hidden={!allowTogglingVisibilty}>
          <div className="min-w-52 max-w-80 h-full">
            <div
              className="p-2 h-5 w-5"
              onClick={() => setSidePanelVisible(!sidePanelVisible)}
            >
              <PanelLeftOpen />
            </div>
          </div>
        </HiddenView>
      </HiddenView>
      <HiddenView hidden={!sidePanelVisible}>
        <div className="p-2 float-left overflow-y-auto">
          <div>
            <HiddenView hidden={!allowTogglingVisibilty}>
              <div
                className="p-2 h-5 w-5"
                onClick={() => setSidePanelVisible(!sidePanelVisible)}
              >
                <PanelLeftClose />
              </div>
            </HiddenView>
            <TreeView root={treeItem} />
          </div>
        </div>
      </HiddenView>
      <div className="relative w-full h-full">
        {selectedView !== undefined && <LoadingView subView={selectedView} />}
      </div>
      <div className="clear-both"></div>
    </div>
  )
}
