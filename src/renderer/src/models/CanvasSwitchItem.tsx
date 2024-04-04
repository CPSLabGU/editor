import TreeViewItem from './TreeViewItem'

export default class CanvasSwitcherItem {
  id: string
  title: string
  children: CanvasSwitcherItem[]
  view: () => JSX.Element | null
  constructor(
    id: string,
    title: string,
    children: CanvasSwitcherItem[],
    view: () => JSX.Element | null
  ) {
    this.id = id
    this.title = title
    this.children = children
    this.view = view
  }

  findChild(key: string): CanvasSwitcherItem | null {
    const path = key.split(',')
    if (path.length == 1 && path[0] == this.id) return this
    if (path.length < 2) return null
    const index = Number(path[1])
    if (this.children.length <= index) return null
    return this.children[index].findChild(path.slice(2).join(','))
  }

  replaceChild(key: string, newChild: CanvasSwitcherItem): void {
    const path = key.split(',')
    if (path.length < 2) return
    const index = Number(path[1])
    if (path.length == 2) {
      this.children[index] = newChild
    } else {
      this.children[index].replaceChild(path.slice(2).join(','), newChild)
    }
  }

  treeViewItem(
    isSelected: (key: string) => boolean,
    setSelected: (key: string) => void,
    isExpanded: (key: string) => boolean,
    setExpanded: (key: string, expanded: boolean) => void
  ): TreeViewItem {
    const childItems = this.children.map((child) => {
      return child.treeViewItem(isSelected, setSelected, isExpanded, setExpanded)
    })
    const item = new TreeViewItem(
      this.id,
      this.title,
      childItems,
      () => isSelected(this.id),
      () => setSelected(this.id),
      () => isExpanded(this.id),
      (expanded: boolean) => setExpanded(this.id, expanded)
    )
    return item
  }
}
