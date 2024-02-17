interface StateInformation {
    properties: StateProperties
    expanded: boolean;
}

interface StateProperties {
    name: string;
    w: number;
    h: number;
}

function State({properties, expanded}: StateInformation) {
  return expanded ? <ExpandedState {...properties} /> : <CollapsedState {...properties} />
}

function CollapsedState({name, w, h}: StateProperties) {
    return (
        <div>
            {name}!
        </div>
    )
}

function ExpandedState({name, w, h}: StateProperties) {
    return (
        <div>
            {name}!
        </div>
    )
}

export default State;
