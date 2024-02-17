import TransitionProperties from "../models/TransitionProperties";

function Transition({source, target, condition, path, color}: TransitionProperties) {
    const svgStyle = {
        top: 0,
        left: 0,
        position: 'absolute'
    }
    const conditionX = path.control0.x + (path.control1.x - path.control0.x) / 2;
    const conditionY = path.control0.y + (path.control1.y - path.control0.y) / 2;
    const conditionStyle = {
        position: 'absolute',
        top: conditionX,
        left: conditionY,
        color: color
    }
    return (
        <div>
            <svg style={svgStyle}>
                <path
                    d={`M ${path.source.x},${path.source.y} C ${path.control0.x},${path.control0.y} ${path.control1.x},${path.control1.y} ${path.target.x},${path.target.y}`}
                    stroke={color}
                    fill={'transparent'}
                    strokeWidth={2}
                    strokeLinejoin={'round'}
                    strokeLinecap={'round'}
                />
            </svg>
            <div class='transition-condition' style={conditionStyle}>
                {condition}
            </div>
        </div>
    );
}

export default Transition;
