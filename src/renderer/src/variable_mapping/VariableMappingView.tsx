import VariableMapping from './VariableMapping'
import { useCallback, ChangeEvent } from 'react'
import '../util/Flex.css'

interface VariableMappingViewArgs {
  mapping: VariableMapping
  setMapping: (newMapping: VariableMapping) => void
  onDelete: () => void
}

export default function VariableMappingView({
  mapping,
  setMapping,
  onDelete
}: VariableMappingViewArgs): JSX.Element {
  const changeSource = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setMapping(new VariableMapping(e.target.value, mapping.destination))
    },
    [mapping, setMapping]
  )
  const changeDestination = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setMapping(new VariableMapping(mapping.source, e.target.value))
    },
    [mapping, setMapping]
  )
  return (
    <div className="flex-row">
      <div className="flex-element">
        <h3>Source</h3>
        <div>
          <input type="text" onChange={changeSource} value={mapping.source} />
        </div>
      </div>
      <div className="flex-element">
        <h3>Destination</h3>
        <div>
          <input type="text" onChange={changeDestination} value={mapping.destination} />
        </div>
      </div>
      <div className="flex-element">
        <div>
          <button onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  )
}
