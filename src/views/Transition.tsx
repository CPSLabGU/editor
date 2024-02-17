import { useCallback, useEffect, useState } from "react";
import TransitionProperties from "../models/TransitionProperties";
import BezierPath from "../models/BezierPath";

function Transition({source, target, condition, path, color}: TransitionProperties) {
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
            <div class='transition-condition' style={conditionStyle}>
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
                    marker-end='url(#head)'
                    onClick={focus}
                />
                <ControlPoints curve={path} isFocused={isFocused}></ControlPoints>
            </svg>
        </div>
    );
}

function ControlPoints({curve, isFocused}: {curve: BezierPath, isFocused: boolean}): JSX.Element {
    if (!isFocused) {
        return <></>;
    }
    return (
        <>
            <circle cx={curve.source.x} cy={curve.source.y} r={5} stroke='red' fillOpacity='0'></circle>
            <circle cx={curve.target.x} cy={curve.target.y} r={5} stroke='yellow' fillOpacity='0'></circle>
            <circle cx={curve.control0.x} cy={curve.control0.y} r={5} fill='green'></circle>
            <circle cx={curve.control1.x} cy={curve.control1.y} r={5} fill='green'></circle>
        </>
    );
}

export default Transition;
