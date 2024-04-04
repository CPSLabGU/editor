import CanvasSwitcherItem from '../models/CanvasSwitchItem'
import LoadingView from './LoadingView'
import TreeView from './TreeView'
import TreeViewItem from '@renderer/models/TreeViewItem'

type ItemDictionary<T> = { [key: string]: T }

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
  setExpanded,
}: CanvasSwitcherArgs): JSX.Element {
  return (
    <_CanvasSwitcher
      key="root"
      item={root}
      getSelected={getSelected}
      setSelected={setSelected}
      getExpanded={getExpanded}
      setExpanded={setExpanded}
    />
  )
}

interface _CanvasSwitcherArgs {
  key: string
  item: CanvasSwitcherItem
  getSelected: () => string | null
  setSelected: (key: string) => void
  getExpanded: () => ItemDictionary<boolean>
  setExpanded: (dictionary: ItemDictionary<boolean>) => void
}

function _CanvasSwitcher({
  key,
  item,
  getSelected,
  setSelected,
  getExpanded,
  setExpanded,
}: _CanvasSwitcherArgs): JSX.Element {
  const treeItem: TreeViewItem = item.treeViewItem(
    key,
    (key: string) => getSelected() === key,
    (key: string) => setSelected(key),
    (key: string) => getExpanded()[key] === true,
    (key: string, expanded: boolean) => setExpanded({ ...getExpanded(), [key]: expanded })
  )
  const selectedKey = getSelected()
  const selectedView: (() => Promise<JSX.Element>) | undefined =
    selectedKey !== null ? item.findChild(selectedKey)?.view : undefined
  return (
    <div>
      <div className="left-panel">
        <TreeView key={key} root={treeItem} />
      </div>
      <div className="right-panel">
        {selectedView !== undefined && <LoadingView loadView={selectedView} />}
      </div>
    </div>
  )
}
