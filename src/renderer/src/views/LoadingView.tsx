import { useEffect, useState } from 'react'

interface LoadingViewArgs {
  keyName: string
  loadView: () => Promise<JSX.Element>
}

export default function LoadingView({ keyName, loadView }: LoadingViewArgs): JSX.Element {
  const [view, setView] = useState<JSX.Element | null>(null)
  const [loaded, setLoaded] = useState<string | null>(null)
  const [inProgress, setInProgress] = useState<string | null>(null)

  useEffect(() => {
    if (inProgress == keyName) return
    if (loaded == keyName) return
    setInProgress(keyName)
    loadView().then((loadedView) => {
      setView(loadedView)
      setInProgress(null)
      setLoaded(keyName)
    })
  }, [loadView, inProgress, setInProgress, loaded, setLoaded, keyName])
  console.log(view)
  if (loaded == keyName && view) {
    return view
  } else {
    return <div>Loading...</div>
  }
}
