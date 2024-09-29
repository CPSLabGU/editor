interface HiddenViewArgs {
  hidden: boolean
  children?: JSX.Element | JSX.Element[] | string | boolean | number
}

export default function HiddenView({ hidden = false, children }: HiddenViewArgs): JSX.Element | JSX.Element[] | string | boolean | number {
  if (hidden) {
    return <></>
  } else {
    return children
  }
}
