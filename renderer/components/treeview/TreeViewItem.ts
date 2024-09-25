export default class TreeViewItem {
  key: string
  title: string
  children: TreeViewItem[]
  isSelected: () => boolean
  setSelected: () => void
  isExpanded: () => boolean
  setExpanded: (expanded: boolean) => void
  constructor(
    key: string,
    title: string,
    children: TreeViewItem[],
    isSelected: () => boolean,
    setSelected: () => void,
    isExpanded: () => boolean,
    setExpanded: (expanded: boolean) => void
  ) {
    this.key = key
    this.title = title
    this.children = children
    this.isSelected = isSelected
    this.setSelected = setSelected
    this.isExpanded = isExpanded
    this.setExpanded = setExpanded
  }
}
