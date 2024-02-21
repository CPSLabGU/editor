// @ts-nocheck

import HiddenView from './HiddenView'
import PanelIcon from './PanelICon'
import SidePanel from './SidePanel'
import '../styles/CanvasSidePanel.css'
import { useState } from 'react'
import PanelChildView from './PanelChildView'
import Machine from '../models/Machine'
import StateInformation from '@renderer/models/StateInformation'

export default function CanvasSidePanel({
  machine,
  states,
  setMachine
}: {
  machine: Machine
  states: { [id: string]: StateInformation }
  setMachine: (newMachine: Machine) => void
}) {
  const [hidden, setHidden] = useState(true)
  return (
    <div onContextMenu={(e) => e.stopPropagation()} className='canvas-side-panel'>
      <HiddenView hidden={!hidden}>
        <div className="canvas-side-panel-hidden">
          <div className="canvas-side-panel-button" onClick={() => setHidden(!hidden)}>
            <PanelIcon />
          </div>
        </div>
      </HiddenView>
      <HiddenView hidden={hidden}>
        <SidePanel>
          <div className="canvas-side-panel-button" onClick={() => setHidden(!hidden)}>
            <PanelIcon />
          </div>
          <div>
            <h2>State Information</h2>
            <div>
              <span>{`Initial State: ${states[machine.initialState].properties.name}`}</span>
            </div>
            <div>
              <span>{`Suspended State: ${machine.suspendedState !== undefined ? states[machine.suspendedState].properties.name : 'none'}`}</span>
            </div>
            <div>
              <button className='remove-suspension' onClick={() => {
                setMachine(new Machine(
                  machine.externalVariables,
                  machine.machineVariables,
                  machine.includes,
                  machine.initialState,
                  undefined
                ))
              }}>
                Remove Suspended State
              </button>
            </div>
          </div>
          <PanelChildView
            category="External Variables"
            data={machine.externalVariables}
            setData={(newData: string) => {
              machine.externalVariables = newData
            }}
          />
          <PanelChildView
            category="Machine Variables"
            data={machine.machineVariables}
            setData={(newData: string) => {
              machine.machineVariables = newData
            }}
          />
          <PanelChildView
            category="Includes"
            data={machine.includes}
            setData={(newData: string) => {
              machine.includes = newData
            }}
          />
        </SidePanel>
      </HiddenView>
    </div>
  )
}
