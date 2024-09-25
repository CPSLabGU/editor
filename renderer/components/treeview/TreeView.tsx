// @ts-nocheck

import { useCallback } from 'react'
import TreeViewItem from './TreeViewItem'

interface TreeViewArgs {
  root: TreeViewItem
}

interface TreeViewLabelArgs {
  item: TreeViewItem
}

export default function TreeView({ root }: TreeViewArgs): JSX.Element {
  const childrenViews = root.isExpanded()
    ? root.children.map((child) => <TreeView key={child.key} root={child} />)
    : []
  return (
    <div>
      <TreeViewLabel item={root} />
      <div className="ml-2">{childrenViews}</div>
    </div>
  )
}

function TreeViewLabel({ item }: TreeViewLabelArgs): JSX.Element {
  const changeSelection = useCallback(
    (e) => {
      e.stopPropagation()
      e.preventDefault()
      item.setSelected()
    },
    [item]
  )
  const changeExpanded = useCallback(
    (e) => {
      e.stopPropagation()
      e.preventDefault()
      item.setExpanded(!item.isExpanded())
    },
    [item]
  )
  const classes = 'p-1' + (item.isSelected() ? ' bg-secondary' : '')
  const expandedClasses = item.isExpanded() ? 'inline-block rotate-90' : ''
  return (
    <p className={classes} onClick={changeSelection} key={item.key}>
      {item.children.length > 0 && (
        <a className={expandedClasses} onClick={changeExpanded}>
          &gt;
        </a>
      )}
      {item.title}
    </p>
  )
}
