import { useCallback } from 'react';
import StateProperties from '../models/StateProperties';
import '../styles/State.css';

function State({properties, isSelected, addSelection, uniqueSelection}: {properties: StateProperties, isSelected: boolean, addSelection: () => void, uniqueSelection: () => void}): JSX.Element {
  const focus = useCallback((e) => {
    if (e.shiftKey) {
      addSelection();
    } else {
      uniqueSelection();
    }
  }, [addSelection, uniqueSelection]);
  return (<div onClick={focus} className={`state ${isSelected ? 'focused' : ''}`}>{properties.expanded ? <ExpandedState  {...properties} /> : <CollapsedState {...properties} />}</div>);
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
