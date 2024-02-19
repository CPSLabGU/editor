// @ts-nocheck

import CodeMirror from '@uiw/react-codemirror'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import '../styles/CodeView.css'
import { useState, useCallback, useEffect } from 'react'
import { finished } from 'stream'

export default function CodeView({
  actions,
  language,
  state,
  variables,
  setActions,
  setState,
  setVariables,
  onExit
}: {
  actions: { [action: string]: string }
  language: string
  state: string
  variables: string
  setActions: (action: string, code: string) => void
  setState: (state: string) => void
  setVariables: (variables: string) => void
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
        <div key={`${state}-variables`}>
          <h2>Variables</h2>
          <CodeMirror
              value={variables}
              theme={vscodeDark}
              readOnly={false}
              lang={language}
              height="100%"
              minHeight="200px"
              onChange={(val, viewUpdate) => {
                setVariables(val)
              }}
            />
        </div>
        {Object.keys(actions)
          .sort()
          .map((action: string) => {
            return (
              <div key={action}>
                <h2>{action}</h2>
                <CodeMirror
                  value={actions[action]}
                  theme={vscodeDark}
                  readOnly={false}
                  lang={language}
                  height="100%"
                  minHeight="200px"
                  onChange={(val, viewUpdate) => {
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
