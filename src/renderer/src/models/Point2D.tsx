export default class Point2D {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.distanceTo = this.distanceTo.bind(this)
  }
  distanceTo(p: Point2D) {
    return Math.sqrt((p.x - this.x) ** 2 + (p.y - this.y) ** 2)
  }
}
