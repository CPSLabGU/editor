import Point2D from "../models/Point2D"
import "../styles/WindowContextMenu.css"

function WindowContextMenu({position, createState}: {position: Point2D, createState: () => void}) {
  const style = {
    top: position.y,
    left: position.x
  }
  return (
    <div style={style} id="context-menu">
      <ul>
        <li onClick={createState}>New State</li>
      </ul>
    </div>
  )
}

export default WindowContextMenu;
