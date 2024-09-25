import MenuItem from './MenuItem'
import Point2D from '../util/Point2D'
import ContextMenu from './ContextMenu'

function WindowContextMenu({
  position,
  createState
}: {
  position: Point2D
  createState: () => void
}): JSX.Element {
  return (
    <ContextMenu
      position={position}
      menuItems={[new MenuItem('createState', 'New State', createState)]}
    />
  )
}

export default WindowContextMenu
