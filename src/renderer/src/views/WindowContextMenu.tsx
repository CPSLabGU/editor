import MenuItem from "../models/MenuItem";
import Point2D from "../models/Point2D"
import ContextMenu from "./ContextMenu";

function WindowContextMenu({position, createState}: {position: Point2D, createState: () => void}) {
  return (
    <ContextMenu position={position} menuItems={[new MenuItem('createState', 'New State', createState)]} />
  )
}

export default WindowContextMenu;
