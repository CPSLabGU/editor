import { useCallback, useState, useEffect } from 'react';
import StateProperties from '../models/StateProperties';
import '../styles/State.css';

function State(properties: StateProperties) {
  const [isFocused, setIsFocused] = useState(false);
  const focus = useCallback(() => setIsFocused(true), [setIsFocused]);
  const unfocus = useCallback(() => setIsFocused(false), [setIsFocused]);
  console.log(isFocused);
  useEffect(() => {
    if (isFocused) {
      window.addEventListener('mousedown', unfocus);
    } else {
      window.removeEventListener('mousedown', unfocus);
    }
    return () => window.removeEventListener('mousedown', unfocus);
  });
  return (<div onClick={focus} className={`state ${isFocused ? 'focused' : ''}`}>{properties.expanded ? <ExpandedState  {...properties} /> : <CollapsedState {...properties} />}</div>);
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
