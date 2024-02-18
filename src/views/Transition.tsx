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
    const conditionX = (path.target.x - path.source.x) / 2;
    const conditionY = (path.target.y - path.source.y) / 2;
    const offset = new Point2D((path.source.x - boundingBox.x) / 2, (path.source.y - boundingBox.y) / 2);
    console.log('offset', offset);
    const parentStyle = {
        position: 'absolute',
        left: path.source.x - offset.x,
        top: path.source.y - offset.y,
    };
    const conditionStyle = {
        position: 'absolute',
        top: `calc(${conditionY + offset.y}px - 1em)`,
        left: conditionX,
        textAlign: 'center',
        color: isFocused ? 'blue' : color,
        width: `${boundingBox.x + 20 + offset.x}px`,
        height: `${boundingBox.y + 20 + offset.y}px`
    }
    const svgStyle = {
        width: `${boundingBox.x + 20 + offset.x}px`,
        height: `${boundingBox.y + 20 + offset.y}px`
    }
    return (
        <div style={parentStyle}>
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
                    d={`M ${offset.x},${offset.y} C ${path.control0.x - path.source.x + offset.x},${path.control0.y - path.source.y + offset.y} ${path.control1.x - path.source.x + offset.x},${path.control1.y - path.source.y + offset.y} ${path.target.x - path.source.x + offset.x},${path.target.y - path.source.y  + offset.y}`}
                    stroke={isFocused ? 'blue' : color}
                    fill={'transparent'}
                    strokeWidth={2}
                    strokeLinejoin={'round'}
                    strokeLinecap={'round'}
                    markerEnd='url(#head)'
                    onClick={focus}
                />
            </svg>
            <ControlPoints curve={path} isFocused={isFocused} setCurve={setPath}></ControlPoints>
        </div>
    );
}

function ControlPoints({curve, isFocused, setCurve}: {curve: BezierPath, isFocused: boolean, setCurve: (newCurve: BezierPath) => void}): JSX.Element {
    if (!isFocused) {
        return <></>;
    }
    const offsetX = curve.source.x
    const offsetY = curve.source.y
    return (
        <div>
            <ControlPoint
                position={new Point2D(0, 0)}
                color='red'
                isFilled={false}
                setPosition={(newPosition) => {
                    setCurve(new BezierPath(newPosition, curve.target, curve.control0, curve.control1))
                }}
            ></ControlPoint>
            <ControlPoint
                position={new Point2D(curve.target.x - offsetX, curve.target.y - offsetY)}
                color='yellow'
                isFilled={false}
                setPosition={(newPosition) => {
                    setCurve(new BezierPath(curve.source, newPosition, curve.control0, curve.control1))
                }}
            ></ControlPoint>
            <ControlPoint
                position={new Point2D(curve.control0.x - offsetX, curve.control0.y - offsetY)}
                color='green'
                isFilled={true}
                setPosition={(newPosition) => {
                    setCurve(new BezierPath(curve.source, curve.target, newPosition, curve.control1))
                }}
            ></ControlPoint>
            <ControlPoint
                position={new Point2D(curve.control1.x - offsetX, curve.control1.y - offsetY)}
                color='green'
                isFilled={true}
                setPosition={(newPosition) => {
                    setCurve(new BezierPath(curve.source, curve.target, curve.control0, newPosition))
                }}
            ></ControlPoint>
        </div>
    );
}

export default Transition;