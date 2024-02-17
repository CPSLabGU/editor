import {useCallback, useState, DragEvent, MouseEvent, useEffect} from 'react';
import Point2D from '../models/Point2D';

function Positionable({position, setPosition, children}) {
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState(position);
  const currentPosition = new Point2D(position.x, position.y);
  const updatePosition = (e) => {
    if (!isDragging) return;
    currentPosition.x += e.movementX;
    currentPosition.y += e.movementY;
    setMousePosition(new Point2D(currentPosition.x, currentPosition.y));
  };
  const endDrag = (e) => {
    setIsDragging(false);
    setPosition(new Point2D(currentPosition.x, currentPosition.y));
  };
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', updatePosition);
      window.addEventListener('mouseup', endDrag);
    } else {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseup', endDrag);
    }
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseup', endDrag);
    };
  }, [position, isDragging, setMousePosition, setPosition]);
  const mouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, [setIsDragging]);
  const positionStyle = {
    left: isDragging ? mousePosition.x : position.x,
    top: isDragging ? mousePosition.y : position.y,
    position: 'absolute'
  };
  const dragStyle = {
    cursor: isDragging ? 'grabbing' : 'grab',
    height: '20px',
    width: '20px',
    backgroundColor: 'black',
    marginLeft: 'auto',
    marginRight: 'auto',
    clear: 'both'
  };
  return (
    <div style={positionStyle}>
      <div draggable={true} onMouseDown={mouseDown}>
        <div style={dragStyle}></div>
      </div>
      {children}
    </div>
  );
}

export default Positionable;
