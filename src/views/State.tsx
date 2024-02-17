import StateInformation from '../models/StateInformation';
import StateProperties from '../models/StateProperties';
import '../styles/State.css';

function State({id, properties, expanded}: StateInformation) {
  return (
    <div className='state'>
        {expanded ? <ExpandedState  {...properties} /> : <CollapsedState {...properties} />}
    </div>
  )
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
