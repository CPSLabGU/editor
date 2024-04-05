import Point2DModel, { instanceOfPoint2DModel } from './Point2DModel'

export default interface BezierPathModel {
  source: Point2DModel

  target: Point2DModel

  control0: Point2DModel

  control1: Point2DModel
}

export function instanceOfBezierPathModel(obj: object): obj is BezierPathModel {
  return (
    'source' in obj &&
    'target' in obj &&
    'control0' in obj &&
    'control1' in obj &&
    typeof obj.source === 'object' &&
    typeof obj.target === 'object' &&
    typeof obj.control0 === 'object' &&
    typeof obj.control1 === 'object' &&
    instanceOfPoint2DModel(obj.source as object) &&
    instanceOfPoint2DModel(obj.target as object) &&
    instanceOfPoint2DModel(obj.control0 as object) &&
    instanceOfPoint2DModel(obj.control1 as object)
  )
}
