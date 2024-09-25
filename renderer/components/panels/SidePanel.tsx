export default function SidePanel({ children }: { children: JSX.Element[] }): JSX.Element {
  return <div className="fixed top-0 right-0 h-screen bg-secondary text-secondary-foreground w-1/4 p-2 overflow-auto">{children}</div>
}
