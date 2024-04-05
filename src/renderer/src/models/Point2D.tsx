import Point2DModel, { instanceOfPoint2DModel } from '@renderer/parsing/Point2DModel'

export default class Point2D {
  x: number
  y: number

  get toModel(): Point2DModel {
    return { x: this.x, y: this.y }
  }

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.distanceTo = this.distanceTo.bind(this)
  }
  distanceTo(p: Point2D): number {
    return Math.sqrt((p.x - this.x) ** 2 + (p.y - this.y) ** 2)
  }

  static fromData(data: string): Point2D | null {
    const obj = JSON.parse(data)
    if (!(typeof obj === 'object')) return null
    if (!instanceOfPoint2DModel(obj as object)) return null
    return Point2D.fromModel(obj as Point2DModel)
  }

  static fromModel(model: Point2DModel): Point2D {
    return new Point2D(model.x, model.y)
  }
}
