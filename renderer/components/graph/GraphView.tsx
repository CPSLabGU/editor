interface GraphViewParameters {
    svgData: string;
}

export default function GraphView({ svgData }: GraphViewParameters): JSX.Element {
    if (!svgData) return (
        <div className="w-full h-full"><></></div>
    )
    return (
        <div className="w-full h-full">
            <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svgData)}`} />
            {/* {svgData} */}
        </div>
    );
}
