import HiddenView from "./HiddenView";
import PanelIcon from "./PanelICon";
import SidePanel from "./SidePanel";
import '../styles/CanvasSidePanel.css'
import { useState } from "react";

export default function CanvasSidePanel() {
  const [hidden, setHidden] = useState(true);
  return (
    <div onContextMenu={(e) => e.stopPropagation() }>
      <HiddenView hidden={!hidden}>
        <div className="canvas-side-panel-hidden">
          <div className='canvas-side-panel-button' onClick={() => setHidden(!hidden)}>
            <PanelIcon />
          </div>
        </div>
      </HiddenView>
      <HiddenView hidden={hidden}>
        <SidePanel>
          <div className='canvas-side-panel-button' onClick={() => setHidden(!hidden)}>
            <PanelIcon />
          </div>
          <p>Hello</p>
        </SidePanel>
      </HiddenView>
    </div>
  );
}