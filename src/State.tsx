import StateInformation from './StateInformation';
import StateProperties from './StateProperties';

function State({id, properties, expanded}: StateInformation) {
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
