// @ts-nocheck

import HiddenView from './HiddenView'
import PanelIcon from './PanelICon'
import SidePanel from './SidePanel'
import '../styles/CanvasSidePanel.css'
import { useState } from 'react'
import PanelChildView from './PanelChildView'
import Machine from '../models/Machine'
import StateInformation from '@renderer/models/StateInformation'
import Clock from '@renderer/models/Clock'
import ClockView from './ClockView'

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
    <div onContextMenu={(e) => e.stopPropagation()} className="canvas-side-panel">
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
              <button
                className="remove-suspension"
                onClick={() => {
                  setMachine(
                    new Machine(
                      machine.externalVariables,
                      machine.machineVariables,
                      machine.includes,
                      machine.initialState,
                      undefined,
                      machine.clocks
                    )
                  )
                }}
              >
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
          <div>
            <h2>Clocks</h2>
            {Object.keys(machine.clocks).map((index: number) => {
              const clock = machine.clocks[index]
              return (
                <ClockView
                  key={`clocks_${index}_${clock.name}_${clock.frequency}`}
                  clock={clock}
                  setClock={(newClock: Clock) => {
                    const clocks = machine.clocks
                    clocks[index] = newClock
                    setMachine(
                      new Machine(
                        machine.externalVariables,
                        machine.machineVariables,
                        machine.includes,
                        machine.initialState,
                        machine.suspendedState,
                        clocks
                      )
                    )
                  }}
                />
              )
            })}
            <div>
              <button
                className="remove-suspension"
                onClick={() => {
                  const clocks = machine.clocks
                  clocks.push(new Clock('clk', '125 MHz'))
                  setMachine(
                    new Machine(
                      machine.externalVariables,
                      machine.machineVariables,
                      machine.includes,
                      machine.initialState,
                      undefined,
                      clocks
                    )
                  )
                }}
              >
                New Clock
              </button>
            </div>
          </div>
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
