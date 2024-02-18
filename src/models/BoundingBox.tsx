import Point2D from "./Point2D"

// A 2D Bounding Box.
export default class BoundingBox {

    x: number
    y: number
    width: number
    height: number
    
    get centre(): Point2D {
        return new Point2D(this.x + this.width / 2, this.y + this.height / 2);
    }

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.findIntersection = this.findIntersection.bind(this);
    }

    findIntersection(angle: number): Point2D {
        const centre = this.centre;
        let angleDeg = angle / Math.PI * 180;
        angleDeg = angleDeg % 360;
        if (angleDeg > 180) {
            angleDeg -= 360;
        }
        if (angleDeg > 135 || angleDeg < -135) {
          return new Point2D(
            centre.x - this.width / 2,
            centre.y + this.width / 2 * Math.tan(angle)
          );
        } else if (angleDeg > 45) {
          return new Point2D(
            centre.x + this.height / 2 / Math.tan(angle),
            centre.y + this.height / 2
          );
        } else if (angleDeg < -45) {
          return new Point2D(
            centre.x + this.height / 2 / Math.tan(angle),
            centre.y - this.height / 2
          );
        } else {
          return new Point2D(
            centre.x + this.width / 2,
            centre.y + this.width / 2 * Math.tan(angle)
          );
        }
      }

}
