interface GraphViewParameters {
    svgData: string;
}

export default function GraphView({ svgData }: GraphViewParameters): JSX.Element {
    return (
        <div className="w-full h-full">
            {svgData}
        </div>
    );
}
