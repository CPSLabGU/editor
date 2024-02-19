import Point2D from './Point2D'
import BoundingBox from './BoundingBox'

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

  constructor(source: Point2D, target: Point2D, control0: Point2D, control1: Point2D) {
    this.source = source
    this.target = target
    this.control0 = control0
    this.control1 = control1
  }
}
