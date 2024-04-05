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
      <button onClick={openArrangement}>Open arrangement</button>
      <button onClick={openMachine}>Open machine</button>
      <button onClick={createArrangement}>Create arrangement</button>
      <button onClick={createMachine}>Create machine</button>
    </div>
  )
}
