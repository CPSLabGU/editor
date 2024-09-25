import * as React from 'react'
import CodeEditor from '../code_editor/CodeEditor'
import { Input } from '../ui/input'

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
}): JSX.Element {
  const [stateName, setStateName] = React.useState(state)
  const changeStateName = React.useCallback(
    (e) => {
      setStateName(e.target.value)
    },
    [setStateName]
  )
  const finishedEditingStateName = React.useCallback(
    (e) => {
      e.preventDefault()
      setState(stateName)
    },
    [setState, stateName]
  )
  const keyPress = React.useCallback(
    (e: KeyboardEvent | React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        const target = e.target as unknown as { value: string, blur: () => void };
        setStateName(target.value)
        target.blur()
      }
    },
    [setStateName]
  )
  React.useEffect(() => {
    setStateName(state)
  }, [state, setStateName])
  const escapePress = React.useCallback(
    (e: KeyboardEvent | React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit()
      }
    },
    [onExit]
  )
  React.useEffect(() => {
    window.addEventListener('keydown', escapePress)
    return () => {
      window.removeEventListener('keydown', escapePress)
    }
  }, [escapePress])
  return (
    <>
      <div className="p-5 bg-background">
        <form onSubmit={finishedEditingStateName}>
          <h1>
            <Input
              type="text"
              className="text-[length:inherit] border-none bg-transparant w-full text-inherit outline-none"
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
