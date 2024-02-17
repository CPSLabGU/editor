import { useCallback, useEffect, useState } from "react";
import TransitionProperties from "../models/TransitionProperties";
import BezierPath from "../models/BezierPath";
import ControlPoint from "./ControlPoint";

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
    const svgStyle = {
        top: 0,
        left: 0,
        position: 'absolute',
    }
    const conditionX = path.control0.x + (path.control1.x - path.control0.x) / 2;
    const conditionY = path.control0.y + (path.control1.y - path.control0.y) / 2;
    const conditionStyle = {
        position: 'absolute',
        top: conditionX,
        left: conditionY,
        color: isFocused ? 'blue' : color
    }
    return (
        <div>
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
                    d={`M ${path.source.x},${path.source.y} C ${path.control0.x},${path.control0.y} ${path.control1.x},${path.control1.y} ${path.target.x},${path.target.y}`}
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
    return (
        <div>
            <ControlPoint
                position={curve.source}
                color='red'
                isFilled={false}
                setPosition={(newPosition) => {
                    setCurve(new BezierPath(newPosition, curve.target, curve.control0, curve.control1))
                }}
            ></ControlPoint>
            <ControlPoint
                position={curve.target}
                color='yellow'
                isFilled={false}
                setPosition={(newPosition) => {
                    setCurve(new BezierPath(curve.source, newPosition, curve.control0, curve.control1))
                }}
            ></ControlPoint>
            <ControlPoint
                position={curve.control0}
                color='green'
                isFilled={true}
                setPosition={(newPosition) => {
                    setCurve(new BezierPath(curve.source, curve.target, newPosition, curve.control1))
                }}
            ></ControlPoint>
            <ControlPoint
                position={curve.control1}
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
