import { RefObject, useCallback, useEffect, useState } from 'react'
import TransitionProperties from './TransitionProperties'
import BezierPath from '../util/BezierPath'
import ControlPoint from './ControlPoint'
import Point2D from '../util/Point2D'
import { useTheme } from 'next-themes'
import { CarTaxiFront } from 'lucide-react'
import { contextIsolated } from 'process'

function Transition({
  id,
  properties,
  priority,
  isSelected,
  canvasRef,
  setPath,
  setCondition,
  addSelection,
  uniqueSelection,
  showContextMenu
}: {
  id: string
  properties: TransitionProperties
  priority: number
  isSelected: boolean
  canvasRef: RefObject<HTMLCanvasElement>
  setPath: (newPath: BezierPath) => void
  setCondition: (condition: string) => void
  addSelection: () => void
  uniqueSelection: () => void
  showContextMenu: (position: Point2D) => void
}): JSX.Element {
  const context = canvasRef.current?.getContext("2d")
  if (!context) {
    return <></>
  }
  const [isEditing, setIsEditing] = useState(false)
  const [localCondition, setLocalCondition] = useState(properties.condition)
  const { resolvedTheme, theme } = useTheme()
  const changeCondition = useCallback(
    (e) => {
      setLocalCondition(e.target.value)
    },
    [setLocalCondition]
  )
  const enableEditing = useCallback(() => {
    setIsEditing(true)
    setLocalCondition(properties.condition)
  }, [setIsEditing])
  const disableEditing = useCallback(
    (e) => {
      e.preventDefault()
      setIsEditing(false)
      setCondition(localCondition)
    },
    [setIsEditing, setCondition, localCondition]
  )
  useEffect(() => {
    setLocalCondition(properties.condition)
  }, [properties.condition])
  const contextMenu = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      showContextMenu(new Point2D(e.clientX, e.clientY))
    },
    [showContextMenu]
  )

  const path = properties.path
  const defaultColor = (resolvedTheme ?? theme) == 'dark' ? 'white' : 'black';
  const color = isSelected ? 'rgb(58, 58, 228)' : defaultColor
  context.lineWidth = 15
  context.beginPath()
  context.moveTo(path.source.x, path.source.y)
  context.bezierCurveTo(
    path.control0.x, path.control0.y, path.control1.x, path.control1.y, path.target.x, path.target.y
  )
  context.strokeStyle = color
  context.stroke()
  const condition = properties.condition
  const focus = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.shiftKey) {
        addSelection()
      } else {
        uniqueSelection()
      }
    },
    [addSelection, uniqueSelection]
  )
  let str = ''
  const gap = 2
  const max = gap * priority
  for (let i = 1; i <= priority; i++) {
    str += `M${i * gap},${max - i * gap} L${i * gap},${max + i * gap} `
  }
  const boundingBox = path.boundingBox
  boundingBox.add(max * 2, max * 2)
  const padding = 20
  const conditionX = path.control0.x + (path.control1.x - path.control0.x) / 2
  const conditionY = path.control0.y + (path.control1.y - path.control0.y) / 2
  const relativeOffset = new Point2D(-boundingBox.x + padding / 2, -boundingBox.y + padding / 2)
  const parentStyle = {
    position: 'absolute' as 'absolute',
    left: boundingBox.x - padding / 2,
    top: boundingBox.y - padding / 2
  }
  const conditionStyle = {
    position: 'absolute' as 'absolute',
    left: `calc(${conditionX + relativeOffset.x}px - 0.2em * ${condition.length})`,
    top: `calc(${conditionY + relativeOffset.y}px - 0.5em)`,
    textAlign: 'center' as 'center',
    color: color
  }
  return (
    <div style={parentStyle} onClick={focus} onContextMenu={contextMenu}>
      <div className="transition-condition text-sm" style={conditionStyle} onDoubleClick={enableEditing}>
        {isEditing && (
          <form onSubmit={disableEditing}>
            <input
              type="text"
              value={localCondition}
              onChange={changeCondition}
              onBlur={disableEditing}
            />
          </form>
        )}
        {!isEditing && properties.condition}
      </div>
      <ControlPoints
        curve={path}
        isSelected={isSelected}
        offset={relativeOffset}
        setCurve={setPath}
      ></ControlPoints>
    </div>
  )
}

function ControlPoints({
  curve,
  isSelected,
  offset,
  setCurve
}: {
  curve: BezierPath
  isSelected: boolean
  offset: Point2D
  setCurve: (newCurve: BezierPath) => void
}): JSX.Element {
  if (!isSelected) {
    return <></>
  }
  return (
    <div>
      <ControlPoint
        position={new Point2D(curve.source.x + offset.x, curve.source.y + offset.y)}
        color="red"
        isFilled={false}
        setPosition={(newPosition) => {
          setCurve(
            new BezierPath(
              new Point2D(newPosition.x - offset.x, newPosition.y - offset.y),
              curve.target,
              curve.control0,
              curve.control1
            )
          )
        }}
      ></ControlPoint>
      <ControlPoint
        position={new Point2D(curve.target.x + offset.x, curve.target.y + offset.y)}
        color="yellow"
        isFilled={false}
        setPosition={(newPosition) => {
          setCurve(
            new BezierPath(
              curve.source,
              new Point2D(newPosition.x - offset.x, newPosition.y - offset.y),
              curve.control0,
              curve.control1
            )
          )
        }}
      ></ControlPoint>
      <ControlPoint
        position={new Point2D(curve.control0.x + offset.x, curve.control0.y + offset.y)}
        color="green"
        isFilled={true}
        setPosition={(newPosition) => {
          setCurve(
            new BezierPath(
              curve.source,
              curve.target,
              new Point2D(newPosition.x - offset.x, newPosition.y - offset.y),
              curve.control1
            )
          )
        }}
      ></ControlPoint>
      <ControlPoint
        position={new Point2D(curve.control1.x + offset.x, curve.control1.y + offset.y)}
        color="green"
        isFilled={true}
        setPosition={(newPosition) => {
          setCurve(
            new BezierPath(
              curve.source,
              curve.target,
              curve.control0,
              new Point2D(newPosition.x - offset.x, newPosition.y - offset.y)
            )
          )
        }}
      ></ControlPoint>
    </div>
  )
}

export default Transition
