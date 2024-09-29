import { useCallback } from 'react'
import StateProperties, { type StatePropertiesInterface } from './StateProperties'
import Point2D from '../util/Point2D'
import Positionable from '../util/Positionable'
import Resizable from '../util/Resizable'
import { Card, CardHeader, CardTitle } from '../ui/card'

function State({
  properties,
  position,
  setPosition,
  setDimensions,
  isSelected,
  addSelection,
  uniqueSelection,
  showContextMenu,
  onDoubleClick = () => {}
}: {
  properties: StateProperties
  position: Point2D
  setPosition: (newPosition: Point2D) => void
  setDimensions: (position: Point2D, dimensions: Point2D) => void
  isSelected: boolean
  addSelection: () => void
  uniqueSelection: () => void
  showContextMenu: (position: Point2D) => void
  onDoubleClick: () => void
}): JSX.Element {
  const focus = useCallback(
    (e) => {
      e.stopPropagation()
      if (e.shiftKey) {
        addSelection()
      } else {
        uniqueSelection()
      }
    },
    [addSelection, uniqueSelection]
  )
  const contextMenu = useCallback(
    (e) => {
      e.preventDefault()
      showContextMenu(new Point2D(e.clientX, e.clientY))
    },
    [showContextMenu]
  )
  const child = (
    <div onClick={focus} className={`h-full text-sm text-center m-2 mx-auto text-ellipsis whitespace-nowrap`}>
      {properties.expanded ? <ExpandedState isSelected={isSelected} {...properties} /> : <CollapsedState isSelected={isSelected} {...properties} />}
    </div>
  )
  return (
    <Positionable
      position={position}
      setPosition={setPosition}
      enabled={isSelected}
      onClick={focus}
      onContextMenu={contextMenu}
      onDoubleClick={onDoubleClick}
    >
      <Resizable
        dimensions={{
          dimensions: new Point2D(properties.w, properties.h),
          minDimensions: new Point2D(100, 50),
          maxDimensions: new Point2D(400, 400)
        }}
        setDimensions={setDimensions}
        position={position}
      >
        {child}
      </Resizable>
    </Positionable>
  )
}

function CollapsedState({ name, w, h, expanded, isSelected }: StatePropertiesInterface & { isSelected: boolean }): JSX.Element {
  return (
    <Card className={`h-[calc(100%-1rem)] overflow:hidden ${isSelected ? 'text-blue-700 border-blue-700' : ''}`}>
      <CardHeader className="h-full justify-center">
        <CardTitle>{name}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function ExpandedState({ name, w, h, expanded, isSelected }: StatePropertiesInterface & { isSelected: boolean }): JSX.Element {
  return (
    <Card className={`h-[calc(100%-1rem)] overflow:hidden ${isSelected ? 'text-blue-700 border-blue-700' : ''}`}>
      <CardHeader className="h-full justify-center">
        <CardTitle>{name}</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default State
