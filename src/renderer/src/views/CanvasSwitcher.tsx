import CanvasSwitcherItem from '../models/CanvasSwitchItem'
import LoadingView from './LoadingView'
import TreeView from './TreeView'
import TreeViewItem from '@renderer/models/TreeViewItem'
import '../styles/CanvasSwitcher.css'
import PanelIcon from './PanelIcon'
import HiddenView from './HiddenView'

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
  console.log(sidePanelVisible)
  return (
    <div className="canvas-switcher">
      <HiddenView hidden={sidePanelVisible}>
        <HiddenView hidden={!allowTogglingVisibilty}>
          <div className="left-panel">
            <div
              className="canvas-switcher-visible-button"
              onClick={() => setSidePanelVisible(!sidePanelVisible)}
            >
              <PanelIcon />
            </div>
          </div>
        </HiddenView>
      </HiddenView>
      <HiddenView hidden={!sidePanelVisible}>
        <div className="left-panel">
          <div>
            <HiddenView hidden={!allowTogglingVisibilty}>
              <div
                className="canvas-switcher-visible-button"
                onClick={() => setSidePanelVisible(!sidePanelVisible)}
              >
                <PanelIcon />
              </div>
            </HiddenView>
            <TreeView root={treeItem} />
          </div>
        </div>
      </HiddenView>
      <div className="right-panel">
        {selectedView !== undefined && <LoadingView subView={selectedView} />}
      </div>
      <div className="end-switcher"></div>
    </div>
  )
}
