import TreeViewItem from './TreeViewItem'

export default class CanvasSwitcherItem {
  title: string
  children: CanvasSwitcherItem[]
  view: () => Promise<JSX.Element>
  constructor(title: string, children: CanvasSwitcherItem[], view: () => Promise<JSX.Element>) {
    this.title = title
    this.children = children
    this.view = view
  }

  findChild(key: string): CanvasSwitcherItem | null {
    const path = key.split(',')
    if (path.length == 0) return null
    if (path.length == 1) return this
    const index = Number(path[1])
    if (this.children.length <= index) return null
    return this.children[index].findChild(path.slice(2).join(','))
  }

  treeViewItem(
    key: string,
    isSelected: (key: string) => boolean,
    setSelected: (key: string) => void,
    isExpanded: (key: string) => boolean,
    setExpanded: (key: string, expanded: boolean) => void
  ): TreeViewItem {
    const childItems = this.children.map((child, index) => {
      return child.treeViewItem(`${key},${index}`, isSelected, setSelected, isExpanded, setExpanded)
    })
    const item = new TreeViewItem(
      key,
      this.title,
      childItems,
      () => isSelected(key),
      () => setSelected(key),
      () => isExpanded(key),
      (expanded: boolean) => setExpanded(key, expanded)
    )
    return item
  }
}
