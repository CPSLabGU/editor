import CanvasSwitcherItem from './CanvasSwitchItem'
import LoadingView from '../util/LoadingView'
import TreeView from '../treeview/TreeView'
import TreeViewItem from '../treeview/TreeViewItem'
import HiddenView from '../util/HiddenView'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Button } from '../ui/button'

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
  return <>
    <div className="w-full bg-muted-foreground flex flex-center">
      <div className="h-full w-full flex flex-row items-start p-1 gap-0.5 justify-left">
        <HiddenView hidden={sidePanelVisible}>
          <HiddenView hidden={!allowTogglingVisibilty}>
            <Button variant="ghost" className="p-1" onClick={() => setSidePanelVisible(true)}>
              <PanelLeftOpen />
            </Button>
          </HiddenView>
        </HiddenView>
        <HiddenView hidden={!sidePanelVisible}>
          <HiddenView hidden={!allowTogglingVisibilty}>
            <Button variant="ghost" className="p-1" onClick={() => setSidePanelVisible(false)}>
              <PanelLeftClose />
            </Button>
          </HiddenView>
        </HiddenView>
      </div>
      <div className="h-full w-full flex flex-row items-end p-1 gap-0.5 justify-end">
      </div>
    </div>
    <div className="w-full h-full flex flex-row items-start gap-2">
      <HiddenView hidden={!sidePanelVisible}>
        <TreeView root={treeItem} />
      </HiddenView>
      <div className="w-full h-full">
        <div className="relative w-full h-full">
          {selectedView !== undefined && <LoadingView subView={selectedView} />}
        </div>
        <div className="clear-both"></div>
      </div>
    </div>
  </>
}
