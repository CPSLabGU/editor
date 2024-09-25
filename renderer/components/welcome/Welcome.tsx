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
      <Button onClick={openArrangement}>Open arrangement</Button>
      <Button onClick={openMachine}>Open machine</Button>
      <Button onClick={createArrangement}>Create arrangement</Button>
      <Button onClick={createMachine}>Create machine</Button>
    </div>
  )
}
