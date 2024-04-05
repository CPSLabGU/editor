export default interface Point2DModel {
  x: number
  y: number
}

export function instanceOfPoint2DModel(obj: object): obj is Point2DModel {
  return 'x' in obj && 'y' in obj && typeof obj.x === 'number' && typeof obj.y === 'number'
}
