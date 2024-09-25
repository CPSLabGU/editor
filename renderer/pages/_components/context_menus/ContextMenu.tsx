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
    <div className="absolute z-50 bg-gray-950 border border-solid border-gray-950" style={{ top: position.y, left: position.x }}>
      <ul className="list-none p-0 m-0 hover:bg-gray-600 font-bold text-black">
        {menuItems.map((menuItem) => (
          <li className="p-1 cursor-pointer " key={menuItem.id} onClick={menuItem.action}>
            {menuItem.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
