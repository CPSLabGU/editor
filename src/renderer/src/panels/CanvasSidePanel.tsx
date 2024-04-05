import HiddenView from '../util/HiddenView'
import PanelIcon from './PanelIcon'
import SidePanel from './SidePanel'
import './CanvasSidePanel.css'
import { useState } from 'react'
import PanelChildView from './PanelChildView'
import Machine from '../machines/Machine'
import Clock from '../clocks/Clock'
import ClockView from '../clocks/ClockView'

export default function CanvasSidePanel({
  machine,
  setMachine
}: {
  machine: Machine
  setMachine: (newMachine: Machine) => void
}): JSX.Element {
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
              <span>{`Initial State: ${machine.states[machine.initialState]?.properties.name ?? 'none'}`}</span>
            </div>
            <div>
              <span>{`Suspended State: ${machine.suspendedState !== undefined ? machine.states[machine.suspendedState]?.properties.name ?? 'none' : 'none'}`}</span>
            </div>
            <div>
              <button
                className="remove-suspension"
                onClick={() => {
                  setMachine(machine.setSuspendedState(undefined))
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
              setMachine(machine.setExternalVariables(newData))
            }}
          />
          <div>
            <h2>Clocks</h2>
            {machine.clocks.map((clock: Clock, index: number) => {
              return (
                <ClockView
                  key={`clocks_${index}_${clock.name}_${clock.frequency}`}
                  clock={clock}
                  setClock={(newClock: Clock) => {
                    const clocks = machine.clocks
                    clocks[index] = newClock
                    setMachine(machine.setClocks(clocks))
                  }}
                  deleteClock={() => {
                    const clocks = machine.clocks
                    clocks.splice(index, 1)
                    setMachine(machine.setClocks(clocks))
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
                  setMachine(machine.setClocks(clocks))
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
              setMachine(machine.setMachineVariables(newData))
            }}
          />
          <PanelChildView
            category="Includes"
            data={machine.includes}
            setData={(newData: string) => {
              setMachine(machine.setIncludes(newData))
            }}
          />
        </SidePanel>
      </HiddenView>
    </div>
  )
}
