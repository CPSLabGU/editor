import Point2D from '../util/Point2D'
import MenuItem from './MenuItem'

export default function ContextMenu({
  position,
  menuItems
}: {
  position: Point2D
  menuItems: MenuItem[]
}): JSX.Element {
  return (
    <div className="absolute z-50 bg-secondary border border-solid border-secondary-foreground" style={{ top: position.y, left: position.x }}>
      <ul className="list-none p-0 m-0 bg-secondary font-bold">
        {menuItems.map((menuItem) => (
          <li className="p-1 cursor-pointer hover:bg-secondary-foreground hover:text-secondary" key={menuItem.id} onClick={menuItem.action}>
            {menuItem.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
