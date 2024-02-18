import MenuItem from "../models/MenuItem";
import Point2D from "../models/Point2D";
import ContextMenu from "./ContextMenu";

function StateContextMenu({position, deleteState}: {position: Point2D, deleteState: () => void}) {
    return (
        <ContextMenu position={position} menuItems={[new MenuItem('delete', 'Delete State', deleteState)]} />
    )
}

export default StateContextMenu;
