// @ts-nocheck

import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import "../styles/CodeView.css";
import { useCallback, useEffect } from "react";

export default function CodeView({actions, language, state, setActions, onExit}: {actions: {[action: string]: string}, language: string, state: string, setActions: (action: string, code: string) => void, onExit: () => void}) {
  const escapePress = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onExit();
    }
  }, [onExit]);
  useEffect(() => {
    window.addEventListener("keydown", escapePress);
    return () => {
      window.removeEventListener("keydown", escapePress);
    };
  }, [escapePress]);
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
                minHeight="200px"
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
