// @ts-nocheck

import { useCallback, useState, MouseEvent, useEffect, useMemo, Children } from 'react'
import Point2D from '../models/Point2D'
import Grip from './Grip'
import '../styles/Positionable.css'

function Positionable({
  position,
  setPosition,
  enabled = true,
  onClick = () => {},
  onContextMenu = (e) => {},
  onDoubleClick = () => {},
  children
}) {
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
  onClick = () => {},
  onContextMenu = (e) => {},
  onDoubleClick = () => {},
  children
}) {
  return (
    <div
      style={{ position: 'absolute', left: position.x, top: position.y }}
      className="prevent-select"
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
  onClick = () => {},
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
      setMousePosition(new Point2D(currentPosition.x, currentPosition.y))
    },
    [isDragging, currentPosition, setMousePosition]
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
    position: 'absolute',
    cursor: isDragging ? 'grabbing' : 'grab'
  }
  const dragStyle = {
    cursor: isDragging ? 'grabbing' : 'grab'
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
