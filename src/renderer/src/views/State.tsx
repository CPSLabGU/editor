// @ts-nocheck

import { useCallback } from 'react';
import StateProperties from '../models/StateProperties';
import '../styles/State.css';
import Point2D from '../models/Point2D';
import Positionable from './Positionable';
import Resizable from './Resizable';

function State({properties, position, setPosition, setDimensions, isSelected, addSelection, uniqueSelection, showContextMenu, onDoubleClick = () => {}}: {properties: StateProperties, position: Point2D, setPosition: (newPosition: Point2D) => void, setDimensions: (position: Point2D, dimensions: Point2D) => void, isSelected: boolean, addSelection: () => void, uniqueSelection: () => void, showContextMenu: (position: Point2D) => void, onDoubleClick: () => void}): JSX.Element {
  const focus = useCallback((e) => {
    e.stopPropagation();
    if (e.shiftKey) {
      addSelection();
    } else {
      uniqueSelection();
    }
  }, [addSelection, uniqueSelection]);
  const contextMenu = useCallback((e) => {
    e.preventDefault();
    showContextMenu(new Point2D(e.clientX, e.clientY));
  }, [showContextMenu]);
  const child = <div onClick={focus} className={`state ${isSelected ? 'focused' : ''}`}>{properties.expanded ? <ExpandedState  {...properties} /> : <CollapsedState {...properties} />}</div>;
  return (
    <Positionable position={position} setPosition={setPosition} enabled={isSelected} onClick={focus} onContextMenu={contextMenu} onDoubleClick={onDoubleClick}>
      <Resizable
        dimensions={
          {
            dimensions: new Point2D(properties.w, properties.h),
            minDimensions: new Point2D(200, 100),
            maxDimensions: new Point2D(400, 400)
          }
        }
        setDimensions={setDimensions}
        position={position}
      >
        {child}
      </Resizable>
    </Positionable>
  );
}

function CollapsedState({name, w, h, expanded}: StateProperties) {
  return (
    <div className='padding'>
      {name}!
    </div>
  )
}

function ExpandedState({name, w, h, expanded}: StateProperties) {
  return (
    <div className='padding'>
      {name}!
    </div>
  )
}

export default State;
