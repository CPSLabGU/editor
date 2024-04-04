import CanvasSwitcherItem from '../models/CanvasSwitchItem'
import LoadingView from './LoadingView'
import TreeView from './TreeView'
import TreeViewItem from '@renderer/models/TreeViewItem'

type ItemDictionary<T> = { [key: string]: T }

interface CanvasSwitcherArgs {
  root: CanvasSwitcherItem
  itemView: (key: string) => Promise<JSX.Element>
  getSelected: () => string | null
  setSelected: (key: string) => void
  getExpanded: () => ItemDictionary<boolean>
  setExpanded: (dictionary: ItemDictionary<boolean>) => void
}

export default function CanvasSwitcher({
  root,
  itemView,
  getSelected,
  setSelected,
  getExpanded,
  setExpanded,
}: CanvasSwitcherArgs): JSX.Element {
  return (
    <_CanvasSwitcher
      key="root"
      item={root}
      itemView={itemView}
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
  itemView: (key: string) => Promise<JSX.Element>
  getSelected: () => string | null
  setSelected: (key: string) => void
  getExpanded: () => ItemDictionary<boolean>
  setExpanded: (dictionary: ItemDictionary<boolean>) => void
}

function _CanvasSwitcher({
  key,
  item,
  itemView,
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
  return (
    <div>
      <div className="left-panel">
        <TreeView key={key} root={treeItem} />
      </div>
      <div className="right-panel">
        {getSelected() !== null && <LoadingView loadView={() => itemView(key)} />}
      </div>
    </div>
  )
}
