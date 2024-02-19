import BezierPath from "./BezierPath";

export default class TransitionProperties {

    source: string;

    target: string;
    
    condition: string;

    path: BezierPath;

    color: string;

    constructor(source: string, target: string, condition: string, path: BezierPath, color: string) {
        this.source = source;
        this.target = target;
        this.condition = condition;
        this.path = path;
        this.color = color;
    }

}
