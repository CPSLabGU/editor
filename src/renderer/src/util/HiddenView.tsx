interface HiddenViewArgs {
  hidden: boolean
  children: JSX.Element
}

export default function HiddenView({ hidden = false, children }: HiddenViewArgs): JSX.Element {
  if (hidden) {
    return <></>
  } else {
    return children
  }
}
