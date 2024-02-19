import MenuItem from '../models/MenuItem'
import Point2D from '../models/Point2D'
import ContextMenu from './ContextMenu'
import StateIdentifier from '../models/StateIdentifier'

function StateContextMenu({
  position,
  states,
  createTransition,
  deleteState
}: {
  position: Point2D
  states: StateIdentifier[]
  createTransition: (stateID: string) => void
  deleteState: () => void
}) {
  return (
    <ContextMenu
      position={position}
      menuItems={[new MenuItem('delete', 'Delete State', deleteState)].concat(
        states.map(
          (identity) =>
            new MenuItem(
              `createTransition(${identity.id})`,
              `Create Transition To ${identity.name}`,
              () => createTransition(identity.id)
            )
        )
      )}
    />
  )
}

export default StateContextMenu
