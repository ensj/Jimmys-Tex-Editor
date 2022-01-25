import MonacoEditor from 'react-monaco-editor';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { useState } from 'react';
import SplitPane from 'react-split-pane';
import { FileObject } from '../../main/util';
import './app.css';

const App = () => {
  const { height, width } = useWindowDimensions();
  const [textContent, setTextContent] = useState('');

  window.electron.ipcRenderer.on('fileOpen', (fileSet: FileObject[]) => {
    console.log('received');
    setTextContent(fileSet[0].content);
  });

  return (
    <SplitPane split="vertical" defaultSize="50%">
      <MonacoEditor
        width={width / 2}
        height={height}
        language="html"
        theme="hc-black"
        value={textContent}
        onChange={(newValue) => setTextContent(newValue)}
      />

      <div>
        <h2>John Doe</h2>
        <p>Some text here too.</p>
      </div>
    </SplitPane>
  );
};

export default App;
