import Point2D from "../models/Point2D"
import '../styles/ContextMenu.css';
import MenuItem from "../models/MenuItem";

export default function ContextMenu({position, menuItems}: {position: Point2D, menuItems: MenuItem[]}) {
  return (
    <div className="context-menu" style={{top: position.y, left: position.x}}>
      <ul>
        {menuItems.map((menuItem) => <li key={menuItem.id} onClick={menuItem.action}>{menuItem.label}</li>)}
      </ul>
    </div>
  )
}