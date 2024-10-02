import { useState } from "react";
import Point2D from "../util/Point2D";
import Positionable from "../util/Positionable";
import Image from "next/image";

interface GraphViewParameters {
    svgData: string;
}

export default function GraphView({ svgData }: GraphViewParameters): JSX.Element {
    const [position, setPosition] = useState(new Point2D(0, 0));
    return (
        <div className="w-full h-full relative select-none">
            {svgData && <Positionable position={position} setPosition={setPosition}>
                <div dangerouslySetInnerHTML={{__html: svgData}}></div>
            </Positionable>}
        </div>
    );
}
