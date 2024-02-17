import StateProperties from '../models/StateProperties';
import '../styles/State.css';

function State(properties: StateProperties) {
  return properties.expanded ? <ExpandedState  {...properties} /> : <CollapsedState {...properties} />
}

function CollapsedState({name, w, h, expanded}: StateProperties) {
    return (
        <div>
            {name}!
        </div>
    )
}

function ExpandedState({name, w, h, expanded}: StateProperties) {
    return (
        <div>
            {name}!
        </div>
    )
}

export default State;
