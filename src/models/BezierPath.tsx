import Point2D from "./Point2D";

export default class BezierPath {

    source: Point2D;

    target: Point2D;

    control0: Point2D;

    control1: Point2D;

    constructor(source: Point2D, target: Point2D, control0: Point2D, control1: Point2D) {
        this.source = source;
        this.target = target;
        this.control0 = control0;
        this.control1 = control1;
    }

}