import { useState } from 'react';
import '../styles/Resizable.css';
import Point2D from '../models/Point2D';

interface ResizableDimensions {
    dimensions: Point2D;
    minDimensions: Point2D;
    maxDimensions: Point2D;
}

function Resizable({dimensions, setDimensions, children}) {
    const [isDragging, setIsDragging] = useState(false);
    const _dimensions = dimensions as ResizableDimensions;
    const _setDimensions = setDimensions as (dimensions: Point2D) => void;

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
                <div className='resize-border top-left'></div>
                <div className='resize-border top-middle'></div>
                <div className='resize-border top-right'></div>
                <div className='clear'></div>
                <div style={middle} className='resize-border left'></div>
                <div style={middle} className='resize-border right'></div>
                <div className='clear'></div>
                <div className='resize-border bottom-left'></div>
                <div className='resize-border bottom-middle'></div>
                <div className='resize-border bottom-right'></div>
            </div>
            <div style={handles} className='resizable-content'>
                {children}
            </div>
        </div>
    );
}

export default Resizable;
