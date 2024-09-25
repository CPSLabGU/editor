import TransitionLayout, { instanceOfTransitionLayout } from './TransitionLayout'

export default interface TransitionModel {
  source: string
  target: string
  condition: string
  layout: TransitionLayout
}

export function instanceOfTransitionModel(obj: object): obj is TransitionModel {
  return (
    'source' in obj &&
    'target' in obj &&
    'condition' in obj &&
    'layout' in obj &&
    typeof obj.source === 'string' &&
    typeof obj.target === 'string' &&
    typeof obj.condition === 'string' &&
    typeof obj.layout === 'object' &&
    instanceOfTransitionLayout(obj.layout as object)
  )
}
