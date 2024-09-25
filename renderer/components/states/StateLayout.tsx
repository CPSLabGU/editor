import Point2DModel, { instanceOfPoint2DModel } from '../util/Point2DModel'

export default interface StateLayout {
  position: Point2DModel
  dimensions: Point2DModel
}

export function instanceOfStateLayout(obj: object): obj is StateLayout {
  return (
    'position' in obj &&
    'dimensions' in obj &&
    typeof obj.position === 'object' &&
    typeof obj.dimensions === 'object' &&
    instanceOfPoint2DModel(obj.position as object) &&
    instanceOfPoint2DModel(obj.dimensions as object)
  )
}
