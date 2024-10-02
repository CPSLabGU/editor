interface GraphViewParameters {
    svgData: string;
}

export default function GraphView({ svgData }: GraphViewParameters): JSX.Element {
    return (
        <div className="w-full h-full">
            {svgData && <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svgData)}`} />}
        </div>
    );
}
