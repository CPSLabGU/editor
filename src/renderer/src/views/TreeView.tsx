// @ts-nocheck

import { useCallback } from 'react'
import TreeViewItem from '../models/TreeViewItem'
import '../styles/TreeView.css'

interface TreeViewArgs {
  root: TreeViewItem
  getSelected: () => number | null
  setSelected: (item: number | null) => void
  getExpanded: () => boolean
  setExpanded: (expanded: boolean) => void
}

interface TreeViewLabelArgs {
  item: TreeViewItem
  index: number
  getSelected: () => number | null
  setSelected: (item: number | null) => void
  getExpanded: () => boolean
  setExpanded: (expanded: boolean) => void
}

export default function TreeView({
  root,
  getSelected,
  setSelected,
  getExpanded,
  setExpanded
}: TreeViewArgs): JSX.Element {
  const childrenLabels = getExpanded()
    ? root.children.map((child) => <div key={child.key}>{child.title}</div>)
    : []
  return (
    <div>
      <TreeViewLabel
        item={root}
        index={-1}
        getSelected={getSelected}
        setSelected={setSelected}
        getExpanded={getExpanded}
        setExpanded={setExpanded}
      />
      <div className={'child'}>{childrenLabels}</div>
    </div>
  )
}

function TreeViewLabel({
  item,
  index,
  getSelected,
  setSelected,
  getExpanded,
  setExpanded
}: TreeViewLabelArgs): JSX.Element {
  const changeSelection = useCallback(
    (e) => {
      e.stopPropagation()
      e.preventDefault()
      setSelected(index)
    },
    [index, setSelected]
  )
  const changeExpanded = useCallback(
    (e) => {
      e.stopPropagation()
      e.preventDefault()
      setExpanded(!getExpanded())
    },
    [getExpanded, setExpanded]
  )
  const classes = getSelected() ? 'selected' : ''
  return (
    <p className={classes} onClick={changeSelection} key={item.key}>
      <a onClick={changeExpanded}>&gt;</a>
      {item.title}
    </p>
  )
}
