import { Button } from "../ui/button"

interface WelcomeArgs {
  openArrangement: () => void
  openMachine: () => void
  createArrangement: () => void
  createMachine: () => void
}

export default function Welcome({
  openArrangement,
  openMachine,
  createArrangement,
  createMachine
}: WelcomeArgs): JSX.Element {
  return (
    <div>
      <Button variant="secondary" onClick={openArrangement}>Open arrangement</Button>
      <Button variant="secondary" onClick={openMachine}>Open machine</Button>
      <Button variant="secondary" onClick={createArrangement}>Create arrangement</Button>
      <Button variant="secondary" onClick={createMachine}>Create machine</Button>
    </div>
  )
}
