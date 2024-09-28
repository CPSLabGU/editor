import Point2D from './Point2D'

// A 2D Bounding Box.
export default class BoundingBox {
  x: number
  y: number
  width: number
  height: number

  get centre(): Point2D {
    return new Point2D(this.x + this.width / 2, this.y + this.height / 2)
  }

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.findIntersection = this.findIntersection.bind(this)
    this.adjustToFit = this.adjustToFit.bind(this)
    this.normalise = this.normalise.bind(this)
    this.contains = this.contains.bind(this)
    this.normaliseWithin = this.normaliseWithin.bind(this)
  }

  findIntersection(angle: number): Point2D {
    const centre = this.centre
    let angleDeg = (angle / Math.PI) * 180
    angleDeg = angleDeg % 360
    if (angleDeg > 180) {
      angleDeg -= 360
    }
    if (angleDeg > 135 || angleDeg < -135) {
      return new Point2D(centre.x - this.width / 2, centre.y + (this.width / 2) * Math.tan(angle))
    } else if (angleDeg > 45) {
      return new Point2D(centre.x + this.height / 2 / Math.tan(angle), centre.y + this.height / 2)
    } else if (angleDeg < -45) {
      return new Point2D(centre.x + this.height / 2 / Math.tan(angle), centre.y - this.height / 2)
    } else {
      return new Point2D(centre.x + this.width / 2, centre.y + (this.width / 2) * Math.tan(angle))
    }
  }

  adjustToFit(width: number, height: number) {
    if (width > this.width) {
      this.x -= (width - this.width) / 2
      this.width = width
    }
    if (height > this.height) {
      this.y -= (height - this.height) / 2
      this.height = height
    }
  }

  add(width: number, height: number) {
    this.x -= width / 2
    this.width = this.width + width
    this.y -= height / 2
    this.height = this.height + height
  }

  contains(point: Point2D): boolean {
    return point.x >= this.x && point.x <= this.x + this.width && point.y >= this.y && point.y <= this.y + this.height
  }

  normalise(point: Point2D, buffer: number = 5): Point2D {
    const newPoint = point.copy
    const centre = this.centre
    if (newPoint.x < centre.x && newPoint.y < this.y + this.height - buffer && newPoint.y > this.y + buffer) {
      newPoint.x = Math.min(Math.max(this.x - buffer, newPoint.x), this.x)
    } else if (newPoint.x > centre.x && newPoint.y < this.y + this.height - buffer && newPoint.y > this.y + buffer) {
      newPoint.x = Math.min(Math.max(this.x + this.width, newPoint.x), this.x + this.width + buffer)
    } else if (newPoint.y < centre.y && newPoint.x < this.x + this.width - buffer && newPoint.x > this.x + buffer) {
      newPoint.y = Math.min(Math.max(this.y - buffer, newPoint.y), this.y)
    } else if (newPoint.y > centre.y && newPoint.x < this.x + this.width - buffer && newPoint.x > this.x + buffer) {
      newPoint.y = Math.min(Math.max(this.y + this.height, newPoint.y), this.y + this.height + buffer)
    } else {
      newPoint.x = Math.max(this.x - buffer, Math.min(this.x + this.width + buffer, newPoint.x))
      newPoint.y = Math.max(this.y - buffer, Math.min(this.y + this.height + buffer, newPoint.y))
    }
    return newPoint
  }

  normaliseWithin(point: Point2D, buffer: number = 5): Point2D {
    const newPoint = point.copy
    const centre = this.centre
    if (newPoint.x < centre.x && newPoint.y < this.y + this.height - buffer && newPoint.y > this.y + buffer) {
      newPoint.x = this.x + buffer
    } else if (newPoint.x > centre.x && newPoint.y < this.y + this.height - buffer && newPoint.y > this.y + buffer) {
      newPoint.x = this.x + this.width - buffer
    } else if (newPoint.y < centre.y && newPoint.x < this.x + this.width - buffer && newPoint.x > this.x + buffer) {
      newPoint.y = this.y + buffer
    } else if (newPoint.y > centre.y && newPoint.x < this.x + this.width - buffer && newPoint.x > this.x + buffer) {
      newPoint.y = this.y + this.height - buffer
    } else {
      newPoint.x = Math.max(this.x + buffer, Math.min(this.x + this.width - buffer, newPoint.x))
      newPoint.y = Math.max(this.y + buffer, Math.min(this.y + this.height - buffer, newPoint.y))
    }
    return newPoint
  }
}
