export default class TreeViewItem {
  key: string
  title: string
  children: TreeViewItem[]
  element: () => JSX.Element
  constructor(key: string, title: string, children: TreeViewItem[], element: () => JSX.Element) {
    this.key = key
    this.title = title
    this.children = children
    this.element = element
  }
}
