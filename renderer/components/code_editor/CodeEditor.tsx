import CodeMirror from '@uiw/react-codemirror'
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode'
import { useTheme } from 'next-themes'

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
  const { resolvedTheme, theme } = useTheme()
  return <>
    {(resolvedTheme ?? theme) == 'dark' && <CodeMirror
      value={sourcecode}
      theme={vscodeDark}
      readOnly={false}
      lang={language}
      height="100%"
      minHeight="200px"
      onChange={(newSourceCode: string) => {
        setSourceCode(newSourceCode)
      }}
    />}
    {(resolvedTheme ?? theme) != 'dark' && <CodeMirror
      value={sourcecode}
      theme={vscodeLight}
      readOnly={false}
      lang={language}
      height="100%"
      minHeight="200px"
      onChange={(newSourceCode: string) => {
        setSourceCode(newSourceCode)
      }}
    />}
  </>
}
