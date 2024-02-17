import { useCallback, useState, MouseEvent, useEffect,useMemo } from 'react';
import '../styles/Resizable.css';
import Point2D from '../models/Point2D';

interface ResizableDimensions {
    dimensions: Point2D;
    minDimensions: Point2D;
    maxDimensions: Point2D;
}

function Resizable({dimensions, setDimensions, position, children}) {
    const _dimensions = dimensions as ResizableDimensions;
    const _setDimensions = setDimensions as (position: Point2D, dimensions: Point2D) => void;
    const _position = position as Point2D;
    const [isDraggingRight, setIsDraggingRight] = useState(false);
    const [isDraggingLeft, setIsDraggingLeft] = useState(false);
    const [isDraggingTop, setIsDraggingTop] = useState(false);
    const [isDraggingBottom, setIsDraggingBottom] = useState(false);
    const isDragging = useCallback(() => isDraggingRight || isDraggingLeft || isDraggingTop || isDraggingBottom, [isDraggingRight, isDraggingLeft, isDraggingTop, isDraggingBottom]);
    const mouseDownRight = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingRight(true)
    }, [setIsDraggingRight]);
    const mouseDownLeft = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingLeft(true)
    }, [setIsDraggingLeft]);
    const mouseDownTop = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingTop(true)
    }, [setIsDraggingTop]);
    const mouseDownBottom = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingBottom(true)
    }, [setIsDraggingBottom]);
    const mouseDownTopRight = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingTop(true);
        setIsDraggingRight(true);
    }, [setIsDraggingTop, setIsDraggingRight]);
    const mouseDownTopLeft = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingTop(true);
        setIsDraggingLeft(true);
    }, [setIsDraggingTop, setIsDraggingLeft]);
    const mouseDownBottomRight = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingBottom(true);
        setIsDraggingRight(true);
    }, [setIsDraggingBottom, setIsDraggingRight]);
    const mouseDownBottomLeft = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingBottom(true);
        setIsDraggingLeft(true);
    }, [setIsDraggingBottom, setIsDraggingLeft]);
    useEffect(() => {
        if (isDragging()) {
            window.addEventListener;
        }
    }, [isDragging]);
    const move = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        let dx = 0;
        let dy = 0;
        let dw = 0;
        let dh = 0;
        if (isDraggingRight) {
            dw += e.movementX;
        }
        if (isDraggingLeft) {
            dw -= e.movementX;
            dx += e.movementX;
        }
        if (isDraggingTop) {
            dh -= e.movementY;
            dy += e.movementY;
        }
        if (isDraggingBottom) {
            dh += e.movementY;
        }
        const tempW = dw + _dimensions.dimensions.x;
        const tempH = dh + _dimensions.dimensions.y;
        let newW = Math.max(Math.min(tempW, _dimensions.maxDimensions.x), _dimensions.minDimensions.x);
        const newH = Math.max(Math.min(tempH, _dimensions.maxDimensions.y), _dimensions.minDimensions.y);
        let newX = _position.x + dx;
        let newY = _position.y;
        if (dw != 0 && dx != 0) {
            const width = Math.abs(tempW - dx);
            if (width > _dimensions.maxDimensions.x) {
                console.log(dx, dy, dw, dh, newX, newY, tempW, tempH, newW, newH, width);
                const overflow = width - _dimensions.maxDimensions.x;
                console.log(overflow);
                newX += overflow / 2;
            } else if (width < _dimensions.minDimensions.x) {
                const underflow = _dimensions.minDimensions.x - width;
                newX -= underflow / 2;
            }
        }
        if (tempH == newH) {
            newY += dy;
        }
        _setDimensions(new Point2D(newX, newY), new Point2D(newW, newH));
    }, [_position, _setDimensions, isDraggingRight, isDraggingLeft, isDraggingTop, isDraggingBottom, _dimensions]);
    const endDrag = useCallback(() => {
        setIsDraggingRight(false);
        setIsDraggingBottom(false);
        setIsDraggingLeft(false);
        setIsDraggingTop(false);
    }, [setIsDraggingRight, setIsDraggingBottom, setIsDraggingLeft, setIsDraggingTop]);
    useEffect(() => {
        if (isDragging()) {
            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', endDrag);
        } else {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', endDrag);
        }
        return () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', endDrag);
        };
    }, [move, isDragging, endDrag]);
    const width = Math.min(
        Math.max(_dimensions.dimensions.x, _dimensions.minDimensions.x, 20),
        _dimensions.maxDimensions.x
    );
    const height = Math.min(
        Math.max(_dimensions.dimensions.y, _dimensions.minDimensions.y, 20),
        _dimensions.maxDimensions.y
    );
    const handles = {
        width: `${width}px`,
        height: `${height}px`
    }
    const middle = {
        width: '10px',
        height: `${height - 20}px`
    }
    return (
        <div>
            <div style={handles} className='handles'>
                <div className='top-left' onMouseDown={mouseDownTopLeft}></div>
                <div className='top-middle' onMouseDown={mouseDownTop}></div>
                <div className='top-right' onMouseDown={mouseDownTopRight}></div>
                <div className='clear'></div>
                <div style={middle} className='left' onMouseDown={mouseDownLeft}></div>
                <div style={middle} className='right' onMouseDown={mouseDownRight}></div>
                <div className='clear'></div>
                <div className='bottom-left' onMouseDown={mouseDownBottomLeft}></div>
                <div className='bottom-middle' onMouseDown={mouseDownBottom}></div>
                <div className='bottom-right' onMouseDown={mouseDownBottomRight}></div>
            </div>
            <div style={handles} className='resizable-content'>
                {children}
            </div>
        </div>
    );
}

export default Resizable;
