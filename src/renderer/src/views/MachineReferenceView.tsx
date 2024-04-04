import MachineReference from '@renderer/models/MachineReference'
import '../styles/Flex.css'
import { useCallback, ChangeEvent } from 'react'
import VariableMappingView from './VariableMappingView'
import VariableMapping from '@renderer/models/VariableMapping'

interface MachineReferenceViewArgs {
  machineReference: MachineReference
  setMachineReference: (newMachineReference: MachineReference) => void
  deleteMachineReference: () => void
}

export default function MachineReferenceView({
  machineReference,
  setMachineReference,
  deleteMachineReference
}: MachineReferenceViewArgs): JSX.Element {
  const changeName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setMachineReference(
        new MachineReference(e.target.value, machineReference.path, machineReference.mappings)
      )
    },
    [machineReference, setMachineReference]
  )
  // const changeDestination = useCallback(
  //   (e: ChangeEvent<HTMLInputElement>) => {
  //     e.preventDefault()
  //     e.stopPropagation()
  //     setMapping(new VariableMapping(mapping.source, e.target.value))
  //   },
  //   [mapping, setMapping]
  // )
  const changeMapping = useCallback(
    (id: string, newMapping: VariableMapping) => {
      const newMappings = { ...machineReference.mappings }
      newMappings[id] = newMapping
      setMachineReference(
        new MachineReference(machineReference.name, machineReference.path, newMappings)
      )
    },
    [machineReference, setMachineReference]
  )
  const mappingViews: JSX.Element[] = []
  for (const key in machineReference.mappings) {
    const mapping = machineReference.mappings[key]
    mappingViews.push(
      <VariableMappingView
        key={key}
        mapping={mapping}
        setMapping={(newMapping: VariableMapping) => changeMapping(key, newMapping)}
      />
    )
  }
  return (
    <div className="flex-row">
      <div className="flex-element">
        <input type="text" onChange={changeName} value={machineReference.name} />
      </div>
      <div>
        <button className="remove-suspension" onClick={deleteMachineReference}>
          Delete instance {machineReference.name}
        </button>
      </div>
      <div>{mappingViews}</div>
    </div>
  )
}
