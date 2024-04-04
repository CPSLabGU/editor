import { useEffect, useState } from 'react'

interface LoadingViewArgs {
  loadView: () => Promise<JSX.Element>
}

export default function LoadingView({ loadView }: LoadingViewArgs): JSX.Element {
  const [view, setView] = useState<JSX.Element | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [inProgress, setInProgress] = useState(false)

  useEffect(() => {
    if (inProgress) return
    if (!isLoading) return
    setInProgress(true)
    loadView().then((loadedView) => {
      setView(loadedView)
      setInProgress(false)
      setIsLoading(false)
    })
  }, [loadView, inProgress, setInProgress, isLoading, setIsLoading])

  if (!isLoading && view) {
    return view
  } else {
    return <div>Loading...</div>
  }
}
