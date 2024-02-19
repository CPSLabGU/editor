import BezierPath from "./BezierPath";

export default class TransitionProperties {

    source: string;

    target: string;
    
    condition: string;

    priority: number;

    path: BezierPath;

    color: string;

    constructor(source: string, target: string, condition: string, priority: number, path: BezierPath, color: string) {
        this.source = source;
        this.target = target;
        this.condition = condition;
        this.priority = priority;
        this.path = path;
        this.color = color;
    }

}