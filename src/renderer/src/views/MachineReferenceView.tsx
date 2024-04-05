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
  const changePath = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setMachineReference(
        new MachineReference(machineReference.name, e.target.value, machineReference.mappings)
      )
    },
    [machineReference, setMachineReference]
  )
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
    <div>
      <div className="flex-row">
        <div className="flex-element">
          <h3>Name</h3>
          <div>
            <input type="text" onChange={changeName} value={machineReference.name} />
          </div>
        </div>
        <div className="flex-element">
          <h3>Path</h3>
          <div>
            <input type="text" onChange={changePath} value={machineReference.path} />
          </div>
        </div>
        <div className="flex-element">
          <button className="remove-suspension" onClick={deleteMachineReference}>
            Delete instance {machineReference.name}
          </button>
        </div>
      </div>
      <div>
        <h3>Variable Mappings</h3>
        <div>{mappingViews}</div>
      </div>
    </div>
  )
}
