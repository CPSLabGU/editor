import { useCallback } from 'react'

interface ManageListViewArgs<Element> {
  list: { [id: string]: Element }
  setList: (setter: (currentList: { [id: string]: Element }) => { [id: string]: Element }) => void
  emptyElement: () => [id: string, element: Element]
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
  emptyElement,
  view
}: ManageListViewArgs<Element>): JSX.Element {
  const createNewEntry = useCallback(() => {
    setList((currentList) => {
      const newList = { ...currentList }
      const [newId, newElement] = emptyElement()
      newList[newId] = newElement
      return newList
    })
  }, [setList, emptyElement])
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
  return (
    <>
      <div>
        <button onClick={createNewEntry}>Add</button>
      </div>
      <div>{elementViews}</div>
    </>
  )
}
