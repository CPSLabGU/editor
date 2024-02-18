import { useCallback, useEffect, useState } from "react";
import TransitionProperties from "../models/TransitionProperties";
import BezierPath from "../models/BezierPath";
import ControlPoint from "./ControlPoint";
import Point2D from "../models/Point2D";

function Transition({properties, setPath}: {properties: TransitionProperties, setPath: (newPath: BezierPath) => void}): JSX.Element {
    const path = properties.path
    const condition = properties.condition
    const color = properties.color
    const [isFocused, setIsFocused] = useState(false);
    const focus = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFocused(true);
    }, [setIsFocused]);
    const unfocus = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFocused(false);
    }, [setIsFocused]);
    useEffect(() => {
        if (isFocused) {
            window.addEventListener('mousedown', unfocus);
        } else {
            window.removeEventListener('mousedown', unfocus);
        }
        return () => {
            window.removeEventListener('mousedown', unfocus);
        };
    }, [isFocused, unfocus]);
    const boundingBox = path.boundingBox
    console.log('');
    console.log('Path:', path.source, path.target, path.control0, path.control1)
    console.log('BoundingBox: ', boundingBox)
    const conditionX = (path.target.x - path.source.x) / 2;
    const conditionY = (path.target.y - path.source.y) / 2;
    const padding = 20;
    const width = boundingBox.width + padding;
    const height = boundingBox.height + padding;
    const offset = new Point2D(width / 2, height / 2);
    console.log('dimensions: ', width, height)
    console.log('offset', offset);
    const relativeOffset = new Point2D(-boundingBox.x + padding / 2, -boundingBox.y + padding / 2);
    console.log('relativeOffset', relativeOffset);
    const relativeCurve = new BezierPath(
        new Point2D(path.source.x + relativeOffset.x, path.source.y + relativeOffset.y),
        new Point2D(path.target.x + relativeOffset.x, path.target.y + relativeOffset.y),
        new Point2D(path.control0.x + relativeOffset.x, path.control0.y + relativeOffset.y),
        new Point2D(path.control1.x + relativeOffset.x, path.control1.y + relativeOffset.y)
    )
    console.log('relativeCurve', relativeCurve.source, relativeCurve.target, relativeCurve.control0, relativeCurve.control1);
    const parentStyle = {
        position: 'absolute',
        left: boundingBox.x - padding / 2,
        top: boundingBox.y - padding / 2,
    };
    const conditionStyle = {
        position: 'absolute',
        left: `calc(${conditionX}px - 0.2em * ${condition.length})`,
        top: `calc(${conditionY}px - 0.5em)`,
        textAlign: 'center',
        color: isFocused ? 'blue' : color
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
                <marker id='head' orient="auto"
                    markerWidth='6' markerHeight='8'
                    refX='0.2' refY='2'>
                    <path d='M0,0 V4 L4,2 Z' fill={isFocused ? 'blue' : color}/>
                </marker>
                </defs>
                <path
                    d={`M ${relativeCurve.source.x},${relativeCurve.source.y} C ${relativeCurve.control0.x},${relativeCurve.control0.y} ${relativeCurve.control1.x},${relativeCurve.control1.y} ${relativeCurve.target.x},${relativeCurve.target.y}`}
                    stroke={isFocused ? 'blue' : color}
                    fill={'transparent'}
                    strokeWidth={2}
                    strokeLinejoin={'round'}
                    strokeLinecap={'round'}
                    markerEnd='url(#head)'
                />
            </svg>
            <ControlPoints curve={path} isFocused={isFocused} offset={relativeOffset} setCurve={setPath}></ControlPoints>
        </div>
    );
}

function ControlPoints({curve, isFocused, offset, setCurve}: {curve: BezierPath, isFocused: boolean, offset: Point2D, setCurve: (newCurve: BezierPath) => void}): JSX.Element {
    if (!isFocused) {
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
