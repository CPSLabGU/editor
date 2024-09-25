import CodeEditor from '../code_editor/CodeEditor'

export default function PanelChildView({
  category,
  data,
  setData
}: {
  category: string
  data: string
  setData: (newData: string) => void
}): JSX.Element {
  return (
    <div key={category} className="mt-2">
      <h2>{category}</h2>
      <CodeEditor language={'javascript'} sourcecode={data} setSourceCode={setData} />
    </div>
  )
}
