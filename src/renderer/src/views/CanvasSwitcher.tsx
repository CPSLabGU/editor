import CanvasSwitcherItem from '../models/CanvasSwitchItem'
import LoadingView from './LoadingView'
import TreeView from './TreeView'
import TreeViewItem from '@renderer/models/TreeViewItem'
import '../styles/CanvasSwitcher.css'

export type ItemDictionary<T> = { [key: string]: T }

interface CanvasSwitcherArgs {
  root: CanvasSwitcherItem
  getSelected: () => string | null
  setSelected: (key: string) => void
  getExpanded: () => ItemDictionary<boolean>
  setExpanded: (dictionary: ItemDictionary<boolean>) => void
}

export default function CanvasSwitcher({
  root,
  getSelected,
  setSelected,
  getExpanded,
  setExpanded
}: CanvasSwitcherArgs): JSX.Element {
  return (
    <_CanvasSwitcher
      item={root}
      getSelected={getSelected}
      setSelected={setSelected}
      getExpanded={getExpanded}
      setExpanded={setExpanded}
    />
  )
}

interface _CanvasSwitcherArgs {
  item: CanvasSwitcherItem
  getSelected: () => string | null
  setSelected: (key: string) => void
  getExpanded: () => ItemDictionary<boolean>
  setExpanded: (dictionary: ItemDictionary<boolean>) => void
}

function _CanvasSwitcher({
  item,
  getSelected,
  setSelected,
  getExpanded,
  setExpanded
}: _CanvasSwitcherArgs): JSX.Element {
  const treeItem: TreeViewItem = item.treeViewItem(
    (key: string) => getSelected() === key,
    (key: string) => setSelected(key),
    (key: string) => getExpanded()[key] === true,
    (key: string, expanded: boolean) => setExpanded({ ...getExpanded(), [key]: expanded })
  )
  const selectedKey = getSelected()
  const selectedView: (() => Promise<JSX.Element>) | undefined =
    selectedKey !== null ? item.findChild(selectedKey)?.view : undefined
  return (
    <div className="canvas-switcher">
      <div className="left-panel">
        <TreeView root={treeItem} />
      </div>
      <div className="right-panel">
        {selectedView !== undefined && (
          <LoadingView keyName={selectedKey as string} loadView={selectedView} />
        )}
      </div>
      <div className="end-switcher"></div>
    </div>
  )
}
