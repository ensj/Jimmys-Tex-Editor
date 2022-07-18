import MonacoEditor from 'react-monaco-editor';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { useEffect, useRef, useState } from 'react';
import { FileObject } from '../../main/util';
import './app.css';

const renderer = window.electron.ipcRenderer;

type EditorPropType = {
  editorSize: number;
};

const App = ({ editorSize }: EditorPropType) => {
  const { height } = useWindowDimensions();
  const [textContent, setTextContent] = useState('');
  const textContentRef = useRef(textContent);

  useEffect(() => {
    textContentRef.current = textContent;
  });

  // useEffect is here so that ipcRenderer subscribes only once
  useEffect(() => {
    renderer.on('fileOpen', (fileSet: FileObject[]) => {
      // todo: open folder, open tab for file?
      setTextContent(fileSet[0].content);
    });
    renderer.on('fileNew', () => {
      // todo: create tabs for monaco text editor, keep track of path and content for each
      setTextContent('');
    });
    renderer.on('fileSave', (filePath: string) => {
      renderer.saveFile(filePath, textContentRef.current);
    });
  }, []);

  return (
    <MonacoEditor
      width={editorSize}
      height={height - 60}
      language="html"
      theme="hc-black"
      value={textContent}
      onChange={(newValue) => setTextContent(newValue)}
    />
  );
};

export default App;
