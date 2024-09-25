import CodeMirror from '@uiw/react-codemirror'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'

interface CodeEditorArgs {
  language: string
  sourcecode: string
  setSourceCode: (newSourceCode: string) => void
}

export default function CodeEditor({
  language,
  sourcecode,
  setSourceCode
}: CodeEditorArgs): JSX.Element {
  return (
    <CodeMirror
      value={sourcecode}
      theme={vscodeDark}
      readOnly={false}
      lang={language}
      height="100%"
      minHeight="200px"
      onChange={(newSourceCode: string) => {
        setSourceCode(newSourceCode)
      }}
    />
  )
}
