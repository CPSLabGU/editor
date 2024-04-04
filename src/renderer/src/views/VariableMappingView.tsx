import VariableMapping from '@renderer/models/VariableMapping'
import { useCallback, ChangeEvent } from 'react'
import '../styles/Flex.css'

interface VariableMappingViewArgs {
  mapping: VariableMapping
  setMapping: (newMapping: VariableMapping) => void
}

export default function VariableMappingView({
  mapping,
  setMapping
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
        <input type="text" onChange={changeSource} value={mapping.source} />
      </div>
      <div className="flex-element">
        <input type="text" onChange={changeDestination} value={mapping.destination} />
      </div>
    </div>
  )
}
