import { useCallback } from 'react'

interface ManageListViewArgs<Element> {
  list: { [id: string]: Element }
  setList: (setter: (currentList: { [id: string]: Element }) => { [id: string]: Element }) => void
  view: (
    id: string,
    element: Element,
    setElement: (newElement: Element) => void,
    deleteElement: () => void
  ) => JSX.Element
}

export default function ManageListView<Element>({
  list,
  setList,
  view
}: ManageListViewArgs<Element>): JSX.Element {
  const changeElement = useCallback(
    (id: string, newElement: Element) => {
      setList((currentList) => {
        const newList = { ...currentList }
        newList[id] = newElement
        return newList
      })
    },
    [list, setList]
  )
  const deleteElement = useCallback(
    (id: string) => {
      setList((currentList) => {
        const newList = { ...currentList }
        delete newList[id]
        return newList
      })
    },
    [list, setList]
  )
  const elementViews = Object.entries(list).map(([id, element]) => (
    <div key={id}>
      {view(
        id,
        element,
        (newElement: Element) => changeElement(id, newElement),
        () => deleteElement(id)
      )}
    </div>
  ))
  return <div>{elementViews}</div>
}
