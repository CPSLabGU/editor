import {useCallback, useState, DragEvent, MouseEvent, useEffect} from 'react';
import Point2D from '../models/Point2D';

function Positionable({position, setPosition, children}) {
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState(position);
  useEffect(() => {
    console.log("useEffect called!");
    if (isDragging) {
      const currentPosition = new Point2D(position.x, position.y);
      window.addEventListener('mousemove', (e) => {
        currentPosition.x += e.movementX;
        currentPosition.y += e.movementY;
        setMousePosition(new Point2D(currentPosition.x, currentPosition.y));
      });
      window.addEventListener('mouseup', () => {
        setIsDragging(false);
        setPosition(new Point2D(currentPosition.x, currentPosition.y))
      });
    } else {
      window.removeEventListener('mousemove', () => {});
      window.removeEventListener('mouseup', () => {});
    }
    return () => {
      window.removeEventListener('mousemove', () => {});
      window.removeEventListener('mouseup', () => {});
    };
  }, [position, isDragging, setMousePosition, setPosition]);
  const mouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    console.log(e);
    console.log("Drag start!");
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
