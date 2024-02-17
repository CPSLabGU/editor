import StateProperties from '../models/StateProperties';
import '../styles/State.css';

function State(properties: StateProperties) {
  return (<div className='state'>{properties.expanded ? <ExpandedState  {...properties} /> : <CollapsedState {...properties} />}</div>);
}

function CollapsedState({name, w, h, expanded}: StateProperties) {
    return (
        <div className='padding'>
            {name}!
        </div>
    )
}

function ExpandedState({name, w, h, expanded}: StateProperties) {
    return (
        <div className='padding'>
            {name}!
        </div>
    )
}

export default State;
