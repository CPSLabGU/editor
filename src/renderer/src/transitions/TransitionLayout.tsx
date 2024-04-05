import BezierPathModel, { instanceOfBezierPathModel } from '../util/BezierPathModel'

export default interface TransitionLayout {
  path: BezierPathModel
}

export function instanceOfTransitionLayout(obj: object): obj is TransitionLayout {
  return (
    'path' in obj && typeof obj.path === 'object' && instanceOfBezierPathModel(obj.path as object)
  )
}
