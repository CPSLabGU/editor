import SidePanel from './SidePanel'
import PanelChildView from './PanelChildView'
import Machine from '../machines/Machine'
import Clock from '../clocks/Clock'
import ClockView from '../clocks/ClockView'
import { Button } from '../ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'

export default function CanvasSidePanel({
  machine,
  setMachine
}: {
  machine: Machine;
  setMachine: (newMachine: Machine) => void;
}): JSX.Element {
  return (
    <div className="h-full" onContextMenu={(e) => e.stopPropagation()}>
        <SidePanel>
          <div className="mt-2">
            <h2>State Information</h2>
            <div>
              <span>{`Initial State: ${machine.states[machine.initialState]?.properties.name ?? 'none'}`}</span>
            </div>
            <div>
              <span>{`Suspended State: ${machine.suspendedState !== undefined ? machine.states[machine.suspendedState]?.properties.name ?? 'none' : 'none'}`}</span>
              <Button
                className="ml-2"
                onClick={() => {
                  setMachine(machine.setSuspendedState(undefined))
                }}
              >
                Remove Suspended State
              </Button>
            </div>
          </div>
          <PanelChildView
            category="External Variables"
            data={machine.externalVariables}
            setData={(newData: string) => {
              setMachine(machine.setExternalVariables(newData))
            }}
          />
          <div className="mt-2">
            <h2>
              Clocks
              <Button
                className="ml-2"
                onClick={() => {
                  const clocks = machine.clocks
                  clocks.push(new Clock('clk', '125 MHz'))
                  setMachine(machine.setClocks(clocks))
                }}
              >
                Add
              </Button>
            </h2>
            <Accordion type="multiple">
              {machine.clocks.map((clock: Clock, index: number) => {
                return <>
                  <AccordionItem key={`clocks_${index}_${clock.name}_${clock.frequency}`} value={`clocks_${index}_${clock.name}_${clock.frequency}`}>
                    <AccordionTrigger>{clock.name}</AccordionTrigger>
                    <AccordionContent>
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
                    </AccordionContent>
                  </AccordionItem>
                </>
              })}
            </Accordion>
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
    </div>
  )
}
