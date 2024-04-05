// @ts-nocheck

import '../styles/CodeView.css'
import { useState, useCallback, useEffect } from 'react'
import CodeEditor from './CodeEditor'

export default function CodeView({
  actions,
  language,
  state,
  variables,
  externalVariables,
  setActions,
  setState,
  setVariables,
  setExternalVariables,
  onExit
}: {
  actions: { [action: string]: string }
  language: string
  state: string
  variables: string
  externalVariables: string
  setActions: (action: string, code: string) => void
  setState: (state: string) => void
  setVariables: (variables: string) => void
  setExternalVariables: (externalVariables: string) => void
  onExit: () => void
}) {
  const [stateName, setStateName] = useState(state)
  const changeStateName = useCallback(
    (e) => {
      setStateName(e.target.value)
    },
    [setStateName]
  )
  const finishedEditingStateName = useCallback(
    (e) => {
      e.preventDefault()
      setState(stateName)
    },
    [setState, stateName]
  )
  const keyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        setStateName(e.target.value)
        e.target.blur()
      }
    },
    [setStateName]
  )
  useEffect(() => {
    setStateName(state)
  }, [state, setStateName])
  const escapePress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit()
      }
    },
    [onExit]
  )
  useEffect(() => {
    window.addEventListener('keydown', escapePress)
    return () => {
      window.removeEventListener('keydown', escapePress)
    }
  }, [escapePress])
  return (
    <>
      <div className="code-container">
        <form className="state-name" onSubmit={finishedEditingStateName}>
          <h1>
            <input
              type="text"
              value={stateName}
              onChange={changeStateName}
              onBlur={finishedEditingStateName}
              onKeyDown={keyPress}
            />
          </h1>
        </form>
        <div key={`${state}-externalVariables`}>
          <h2>External Variables</h2>
          <CodeEditor
            language={language}
            sourcecode={externalVariables}
            setSourceCode={setExternalVariables}
          />
        </div>
        <div key={`${state}-variables`}>
          <h2>Variables</h2>
          <CodeEditor language={language} sourcecode={variables} setSourceCode={setVariables} />
        </div>
        {Object.keys(actions)
          .sort()
          .map((action: string) => {
            return (
              <div key={action}>
                <h2>{action}</h2>
                <CodeEditor
                  language={language}
                  sourcecode={actions[action]}
                  setSourceCode={(val: string): void => {
                    setActions(action, val)
                  }}
                />
              </div>
            )
          })}
      </div>
    </>
  )
}
