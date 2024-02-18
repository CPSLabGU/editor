import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import "../styles/CodeView.css";

export default function CodeView({actions, language, state, setActions}: {actions: {[action: string]: string}, language: string, state: string, setActions: (action: string, code: string) => void}) {
  return (
    <>
      <div className="code-container">
      <h1>{state}</h1>
      {
        Object.keys(actions).sort().map((action: string) => {
          return (
            <div key={action}>
              <h2>{action}</h2>
              <CodeMirror
                value={actions[action]}
                theme={vscodeDark}
                readOnly={false}
                lang={language}
                height="100%"
                onChange={(val, viewUpdate) => { setActions(action, val); }}
              />
            </div>
          );
        })
      }
      </div>
    </>
  );
}
