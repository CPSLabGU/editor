import Point2D from "../models/Point2D";
import ContextMenu from "./ContextMenu";

function StateContextMenu({position, deleteState}: {position: Point2D, deleteState: () => void}) {
    return (
        <ContextMenu position={position} menuItems={{'Delete State': deleteState}} />
    )
}

export default StateContextMenu;
