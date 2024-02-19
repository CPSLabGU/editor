import { useCallback } from "react";
import TransitionProperties from "../models/TransitionProperties";
import BezierPath from "../models/BezierPath";
import ControlPoint from "./ControlPoint";
import Point2D from "../models/Point2D";
import '../styles/Transition.css'

function Transition({id, properties, isSelected, setPath, addSelection, uniqueSelection}: {id: string, properties: TransitionProperties, isSelected: boolean, setPath: (newPath: BezierPath) => void, addSelection: () => void, uniqueSelection: () => void}): JSX.Element {
    const path = properties.path
    const condition = properties.condition
    const color = properties.color
    const focus = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.shiftKey) {
            addSelection();
        } else {
            uniqueSelection();
        }
    }, [addSelection, uniqueSelection]);
    let str = '';
    const gap = 2;
    const max = gap * properties.priority;
    for (let i = 1; i <= properties.priority; i++) {
        str += `M${i * gap},${max - i * gap} L${i * gap},${max + i * gap} `
    }
    const boundingBox = path.boundingBox;
    boundingBox.add(max * 2, max * 2);
    const padding = 20;
    const conditionX = path.control0.x + (path.control1.x - path.control0.x) / 2;
    const conditionY = path.control0.y + (path.control1.y - path.control0.y) / 2;
    const relativeOffset = new Point2D(-boundingBox.x + padding / 2, -boundingBox.y + padding / 2);
    const relativeCurve = new BezierPath(
        new Point2D(path.source.x + relativeOffset.x, path.source.y + relativeOffset.y),
        new Point2D(path.target.x + relativeOffset.x, path.target.y + relativeOffset.y),
        new Point2D(path.control0.x + relativeOffset.x, path.control0.y + relativeOffset.y),
        new Point2D(path.control1.x + relativeOffset.x, path.control1.y + relativeOffset.y)
    );
    const parentStyle = {
        position: 'absolute',
        left: boundingBox.x - padding / 2,
        top: boundingBox.y - padding / 2,
    };
    const conditionStyle = {
        position: 'absolute',
        left: `calc(${conditionX + relativeOffset.x}px - 0.2em * ${condition.length})`,
        top: `calc(${conditionY + relativeOffset.y}px - 0.5em)`,
        textAlign: 'center',
        color: isSelected ? 'blue' : color
    }
    const svgStyle = {
        width: `${boundingBox.width + padding}px`,
        height: `${boundingBox.height + padding}px`
    }
    return (
        <div style={parentStyle} onClick={focus}>
            <div className='transition-condition' style={conditionStyle}>
                {condition}
            </div>
            <svg style={svgStyle}>
                <defs>
                    <marker id={`${id}${properties.priority}strokes`} orient="auto"
                        markerWidth={max * 2 + gap} markerHeight={max * 2 + gap}
                        refX="0" refY={max}
                    >
                        <path d={str} stroke={isSelected ? 'blue' : color} />
                        {/* <path d='M2,4 L2,8' stroke={isSelected ? 'blue' : color} />
                        <path d='M4,2 L4,10' stroke={isSelected ? 'blue' : color} />
                        <path d='M6,0 L6,12' stroke={isSelected ? 'blue' : color} /> */}
                    </marker>
                    {/* <marker id='strokes' orient="auto"
                        markerWidth='12' markerHeight='20'
                        refX="0" refY={6}
                    >
                        <path d='M2,4 L2,8' stroke={isSelected ? 'blue' : color} />
                        <path d='M4,2 L4,10' stroke={isSelected ? 'blue' : color} />
                        <path d='M6,0 L6,12' stroke={isSelected ? 'blue' : color} />
                    </marker> */}
                    <marker id={`${id}${properties.priority}head`} orient="auto"
                        markerWidth='6' markerHeight='8'
                        refX='0.2' refY='2'>
                        <path d='M0,0 V4 L4,2 Z' fill={isSelected ? 'blue' : color}/>
                    </marker>
                </defs>
                <path
                    d={`M ${relativeCurve.source.x},${relativeCurve.source.y} C ${relativeCurve.control0.x},${relativeCurve.control0.y} ${relativeCurve.control1.x},${relativeCurve.control1.y} ${relativeCurve.target.x},${relativeCurve.target.y}`}
                    className='transition'
                    stroke={isSelected ? 'blue' : color}
                    fill={'transparent'}
                    strokeWidth={2}
                    strokeLinejoin={'round'}
                    strokeLinecap={'round'}
                    markerEnd={`url(#${id}${properties.priority}head)`}
                    markerStart={`url(#${id}${properties.priority}strokes)`}
                />
            </svg>
            <ControlPoints curve={path} isSelected={isSelected} offset={relativeOffset} setCurve={setPath}></ControlPoints>
        </div>
    );
}

function ControlPoints({curve, isSelected, offset, setCurve}: {curve: BezierPath, isSelected: boolean, offset: Point2D, setCurve: (newCurve: BezierPath) => void}): JSX.Element {
    if (!isSelected) {
        return <></>;
    }
    return (
        <div>
            <ControlPoint
                position={new Point2D(curve.source.x + offset.x, curve.source.y + offset.y)}
                color='red'
                isFilled={false}
                setPosition={(newPosition) => {
                    setCurve(
                        new BezierPath(
                            new Point2D(
                                newPosition.x - offset.x,
                                newPosition.y - offset.y
                            ),
                            curve.target,
                            curve.control0,
                            curve.control1
                        )
                    )
                }}
            ></ControlPoint>
            <ControlPoint
                position={new Point2D(curve.target.x + offset.x, curve.target.y + offset.y)}
                color='yellow'
                isFilled={false}
                setPosition={(newPosition) => {
                    setCurve(
                        new BezierPath(
                            curve.source,
                            new Point2D(
                                newPosition.x - offset.x,
                                newPosition.y - offset.y
                            ),
                            curve.control0,
                            curve.control1
                        )
                    )
                }}
            ></ControlPoint>
            <ControlPoint
                position={new Point2D(curve.control0.x + offset.x, curve.control0.y + offset.y)}
                color='green'
                isFilled={true}
                setPosition={(newPosition) => {
                    setCurve(
                        new BezierPath(
                            curve.source,
                            curve.target,
                            new Point2D(
                                newPosition.x - offset.x,
                                newPosition.y - offset.y
                            ),
                            curve.control1
                        )
                    )
                }}
            ></ControlPoint>
            <ControlPoint
                position={new Point2D(curve.control1.x + offset.x, curve.control1.y + offset.y)}
                color='green'
                isFilled={true}
                setPosition={(newPosition) => {
                    setCurve(
                        new BezierPath(
                            curve.source,
                            curve.target,
                            curve.control0,
                            new Point2D(
                                newPosition.x - offset.x,
                                newPosition.y - offset.y
                            )
                        )
                    )
                }}
            ></ControlPoint>
        </div>
    );
}

export default Transition;
