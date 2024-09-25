import { useCallback } from 'react'
import { Button } from '../ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'

interface ManageListViewArgs<Element> {
  list: { [id: string]: Element }
  setList: (setter: (currentList: { [id: string]: Element }) => { [id: string]: Element }) => void
  emptyElement: () => [id: string, element: Element]
  titleView: (button: JSX.Element) => JSX.Element
  triggerView: (id: string, element: Element) => JSX.Element,
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
  titleView,
  triggerView,
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
    <AccordionItem value={id}>
      <AccordionTrigger>{triggerView(id, element)}</AccordionTrigger>
      <AccordionContent>
        {view(
          id,
          element,
          (newElement: Element) => changeElement(id, newElement),
          () => deleteElement(id)
        )}
      </AccordionContent>
    </AccordionItem>
  ))
  return (
    <>
      <div>
        {titleView(<Button variant="secondary" onClick={createNewEntry}>Add</Button>)}
      </div>
      <Accordion type="multiple">
        {elementViews}
      </Accordion>
    </>
  )
}
