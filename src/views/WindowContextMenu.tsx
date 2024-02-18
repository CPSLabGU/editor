import Point2D from "../models/Point2D"
import ContextMenu from "./ContextMenu";

function WindowContextMenu({position, createState}: {position: Point2D, createState: () => void}) {
  return (
    <ContextMenu position={position} menuItems={{'New State': createState}} />
  )
}

export default WindowContextMenu;
