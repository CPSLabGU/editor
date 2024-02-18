import Point2D from "../models/Point2D"
import '../styles/ContextMenu.css';

export default function ContextMenu({position, menuItems}: {position: Point2D, menuItems: { [label: string]: () => void }}) {
  return (
    <div className="context-menu" style={{top: position.y, left: position.x}}>
      <ul>
        {Object.keys(menuItems).map((label) => <li key={label} onClick={menuItems[label]}>{label}</li>)}
      </ul>
    </div>
  )
}