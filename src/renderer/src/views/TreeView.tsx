// @ts-nocheck

import { useCallback } from 'react'
import TreeViewItem from '../models/TreeViewItem'
import '../styles/TreeView.css'

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
      <div className={'child'}>{childrenViews}</div>
    </div>
  )
}

function TreeViewLabel({ item }: TreeViewLabelArgs): JSX.Element {
  const changeSelection = useCallback(
    (e) => {
      e.stopPropagation()
      e.preventDefault()
      setSelected()
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
  const classes = getSelected() ? 'selected' : ''
  return (
    <p className={classes} onClick={changeSelection} key={item.key}>
      <a onClick={changeExpanded}>&gt;</a>
      {item.title}
    </p>
  )
}
