import Point2D from './Point2D'
import BoundingBox from './BoundingBox'
import BezierPathModel, { instanceOfBezierPathModel } from './BezierPathModel'

export default class BezierPath {
  source: Point2D

  target: Point2D

  control0: Point2D

  control1: Point2D

  get boundingBox(): BoundingBox {
    return new BoundingBox(
      Math.min(this.source.x, this.target.x, this.control0.x, this.control1.x),
      Math.min(this.source.y, this.target.y, this.control0.y, this.control1.y),
      Math.max(this.source.x, this.target.x, this.control0.x, this.control1.x) -
        Math.min(this.source.x, this.target.x, this.control0.x, this.control1.x),
      Math.max(this.source.y, this.target.y, this.control0.y, this.control1.y) -
        Math.min(this.source.y, this.target.y, this.control0.y, this.control1.y)
    )
  }

  get copy(): BezierPath {
    return new BezierPath(this.source, this.target, this.control0, this.control1)
  }

  get toModel(): BezierPathModel {
    return {
      source: this.source.toModel,
      target: this.target.toModel,
      control0: this.control0.toModel,
      control1: this.control1.toModel
    }
  }

  constructor(source: Point2D, target: Point2D, control0: Point2D, control1: Point2D) {
    this.source = source
    this.target = target
    this.control0 = control0
    this.control1 = control1
  }

  static fromData(data: string): BezierPath | null {
    const obj = JSON.parse(data)
    if (!(typeof obj === 'object')) return null
    if (!instanceOfBezierPathModel(obj as object)) return null
    return BezierPath.fromModel(obj as BezierPathModel)
  }

  static fromModel(model: BezierPathModel): BezierPath {
    return new BezierPath(
      Point2D.fromModel(model.source),
      Point2D.fromModel(model.target),
      Point2D.fromModel(model.control0),
      Point2D.fromModel(model.control1)
    )
  }
}
