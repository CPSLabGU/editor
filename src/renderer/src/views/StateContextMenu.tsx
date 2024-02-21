import MenuItem from '../models/MenuItem'
import Point2D from '../models/Point2D'
import ContextMenu from './ContextMenu'
import StateIdentifier from '../models/StateIdentifier'
import Machine from '@renderer/models/Machine'

function StateContextMenu({
  position,
  states,
  createTransition,
  deleteState,
  setInitialState,
  setSuspendedState
}: {
  position: Point2D
  states: StateIdentifier[]
  initialState: string
  createTransition: (stateID: string) => void
  deleteState: () => void
  setInitialState: () => void
  setSuspendedState: () => void
}) {
  const menuItems = [
    new MenuItem('delete', 'Delete State', deleteState),
    new MenuItem('makeInitial', 'Make Initial State', setInitialState),
    new MenuItem('makeSuspended', 'Make Suspended State', setSuspendedState)
  ].concat(
    states.map((identity) => {
      return new MenuItem(
        `createTransition(${identity.id})`,
        `Create Transition To ${identity.name}`,
        () => createTransition(identity.id)
      )
    })
  )
  return <ContextMenu position={position} menuItems={menuItems} />
}

export default StateContextMenu
