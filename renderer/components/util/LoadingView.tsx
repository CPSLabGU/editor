interface LoadingViewArgs {
  subView: () => JSX.Element | null
}

export default function LoadingView({ subView }: LoadingViewArgs): JSX.Element {
  return subView() || <div>Loading...</div>
}
