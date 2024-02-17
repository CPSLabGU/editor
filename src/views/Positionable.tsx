import {useCallback, useState, DragEvent, MouseEvent} from 'react';

function Positionable({position, children}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
    console.log(e);
    console.log("Drag start!");
  }, [setIsDragging]);
  const dragEnd = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    console.log(e);
    console.log("Drag end!");
  }, [setIsDragging]);
  const drag = useCallback((e: DragEvent) => {
    e.preventDefault();
    console.log(e);
    console.log(isDragging);
    console.log("Dragging!");
  }, [isDragging]);
  const mouseUp = useCallback((e: MouseEvent) => {
    e.preventDefault();
    console.log(e);
    console.log("Mouse up!");
    setIsDragging(false);
  }, [setIsDragging]);
  const positionStyle = {
    left: position.x,
    top: position.y,
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
      <div style={dragStyle} onDragStart={dragStart} onDrag={drag} onDragEnd={dragEnd} onMouseUp={mouseUp}></div>
      {children}
    </div>
  );
}

export default Positionable;
