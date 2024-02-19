// @ts-nocheck

import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

export default function PanelChildView({category, data, setData}: {category: string, data: string, setData: (newData: string) => void}) {
  return (<div key={category}>
    <h2>{category}</h2>
    <CodeMirror
      value={data}
      theme={vscodeDark}
      readOnly={false}
      lang={"javascript"}
      height="100%"
      minHeight="200px"
      onChange={(val, viewUpdate) => { setData(val); }}
    />
  </div>);
}
