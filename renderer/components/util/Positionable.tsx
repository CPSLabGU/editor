import { useCallback, useState, MouseEvent, useEffect, useMemo } from 'react'
import Point2D from './Point2D'

function Positionable({
  position,
  setPosition,
  enabled = true,
  grabCursor = 'grab',
  grabbingCursor = 'grabbing',
  onClick = (e: any) => {},
  onContextMenu = (e) => {},
  onDoubleClick = () => {},
  children
}): JSX.Element {
  if (!enabled) {
    return (
      <DisabledView
        position={position}
        onClick={onClick}
        onContextMenu={onContextMenu}
        onDoubleClick={onDoubleClick}
      >
        {children}
      </DisabledView>
    )
  } else {
    return (
      <EnabledView
        position={position}
        setPosition={setPosition}
        grabCursor={grabCursor}
        grabbingCursor={grabbingCursor}
        onClick={onClick}
        onContextMenu={onContextMenu}
        onDoubleClick={onDoubleClick}
      >
        {children}
      </EnabledView>
    )
  }
}

function DisabledView({
  position,
  onClick = (e: any) => {},
  onContextMenu = (e) => {},
  onDoubleClick = () => {},
  children
}) {
  return (
    <div
      style={{ position: 'absolute', left: position.x, top: position.y }}
      className="select-none"
      onClick={onClick}
      onContextMenu={onContextMenu}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </div>
  )
}

function EnabledView({
  position,
  setPosition,
  grabCursor,
  grabbingCursor,
  onClick = (e: any) => {},
  onContextMenu = (e) => {},
  onDoubleClick = () => {},
  children
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [mousePosition, setMousePosition] = useState(position)
  const currentPosition = useMemo(() => new Point2D(position.x, position.y), [position])
  const updatePosition = useCallback(
    (e) => {
      if (!isDragging) return
      currentPosition.x += e.movementX
      currentPosition.y += e.movementY
      const newPoint = new Point2D(currentPosition.x, currentPosition.y)
      setMousePosition(newPoint)
      setPosition(newPoint)
    },
    [isDragging, currentPosition, setMousePosition, setPosition]
  )
  const endDrag = useCallback(
    (e) => {
      setIsDragging(false)
      setPosition(new Point2D(currentPosition.x, currentPosition.y))
    },
    [setIsDragging, setPosition, currentPosition]
  )
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', updatePosition)
      window.addEventListener('mouseup', endDrag)
    } else {
      window.removeEventListener('mousemove', updatePosition)
      window.removeEventListener('mouseup', endDrag)
    }
    return () => {
      window.removeEventListener('mousemove', updatePosition)
      window.removeEventListener('mouseup', endDrag)
    }
  }, [updatePosition, endDrag, isDragging])
  const mouseDown = useCallback(
    (e: MouseEvent) => {
      setIsDragging(true)
    },
    [setIsDragging]
  )
  const positionStyle = {
    left: isDragging ? mousePosition.x : position.x,
    top: isDragging ? mousePosition.y : position.y,
    position: 'absolute' as 'absolute',
    cursor: isDragging ? grabbingCursor : grabCursor
  }
  const dragStyle = {
    cursor: isDragging ? grabbingCursor : grabCursor
  }
  return (
    <div
      style={positionStyle}
      className="prevent-select"
      onMouseDown={mouseDown}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onDoubleClick={onDoubleClick}
    >
      {/* <div className='drag'>
        <div><Grip /></div>
      </div> */}
      {children}
    </div>
  )
}

export default Positionable
