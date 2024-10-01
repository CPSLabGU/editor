import CodeEditor from "../code_editor/CodeEditor";
import GraphView from "../graph/GraphView";
import Machine from "../machines/Machine";
import { Button } from "../ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizeable";

interface VerificationViewParameters {
  machine: Machine;
  setMachine: (newMachine: Machine) => void;
}

export default function VerificationView({ machine, setMachine }: VerificationViewParameters): JSX.Element {
  return (
    <div className="w-full h-full">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel>{machine.kripkeStructure && <GraphView svgData={machine.kripkeStructure} />}</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div className="p-2">
            <div className="flex flex-row items-center gap-0 w-full py-2">
              <div className="flex flex-row items-start gap-1 w-full">
                <h1>Specification</h1>
              </div>
              <div className="flex flex-row items-end gap-1 w-full">
                <div className="text-right w-full">
                  <Button>Run</Button>
                </div>
              </div>
            </div>
            <div>
              <CodeEditor
                  language="tctl"
                  sourcecode={machine.spec}
                  setSourceCode={(val: string) => setMachine(machine.setSpec(val))}
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
