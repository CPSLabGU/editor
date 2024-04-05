import BezierPath from './BezierPath'

export default class TransitionProperties {
  source: string

  target: string

  condition: string

  path: BezierPath

  color: string

  get copy(): TransitionProperties {
    return new TransitionProperties(
      this.source,
      this.target,
      this.condition,
      this.path.copy,
      this.color
    )
  }

  get shallowCopy(): TransitionProperties {
    return new TransitionProperties(this.source, this.target, this.condition, this.path, this.color)
  }

  constructor(source: string, target: string, condition: string, path: BezierPath, color: string) {
    this.source = source
    this.target = target
    this.condition = condition
    this.path = path
    this.color = color
  }
}
