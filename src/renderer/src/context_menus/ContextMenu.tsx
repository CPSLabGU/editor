import Point2D from '../util/Point2D'
import './ContextMenu.css'
import MenuItem from './MenuItem'

export default function ContextMenu({
  position,
  menuItems
}: {
  position: Point2D
  menuItems: MenuItem[]
}): JSX.Element {
  return (
    <div className="context-menu" style={{ top: position.y, left: position.x }}>
      <ul>
        {menuItems.map((menuItem) => (
          <li key={menuItem.id} onClick={menuItem.action}>
            {menuItem.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
