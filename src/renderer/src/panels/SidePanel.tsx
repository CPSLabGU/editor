import './SidePanel.css'

export default function SidePanel({ children }: { children: JSX.Element[] }): JSX.Element {
  return <div className="side-panel">{children}</div>
}
