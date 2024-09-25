import { Button } from '../ui/button'
import { Input } from '../ui/input'
import VariableMapping from './VariableMapping'
import { useCallback, ChangeEvent } from 'react'

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
    <div className="flex flex-row gap-1">
      <div className="w-full">
        <h3>Source</h3>
        <div>
          <Input type="text" className="w-full min-w-80" onChange={changeSource} value={mapping.source} />
        </div>
      </div>
      <div className="w-full">
        <h3>Destination</h3>
        <div>
          <Input type="text" className="w-full min-w-80" onChange={changeDestination} value={mapping.destination} />
        </div>
      </div>
      <div className="w-full mt-auto">
        <Button variant="secondary" onClick={onDelete}>Delete</Button>
      </div>
    </div>
  )
}
