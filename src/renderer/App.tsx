import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SplitPane from 'react-split-pane';
import TeXRenderer from 'components/TeXRenderer';
import { useState } from 'react';
import { Box, Breadcrumbs, Button, Typography } from '@mui/material';
import Editor from '../components/Editor';
import FileMenu from '../components/FileMenu';

const MainPage = () => {
  const [editorSize, setEditorSize] = useState(583);

  window.addEventListener('resize', () => {
    // set height
  });

  return (
    <div>
      <SplitPane split="vertical" size={200} maxSize={300} primary="first">
        <FileMenu />
        <div>
          {/** put another render button and breadcrumb here */}
          <Box>
            <Button variant="contained">Render</Button>
            <Breadcrumbs aria-label="breadcrumb">
              <div>Desktop</div>
              <div>Projects</div>
              <Typography color="text.primary">Example.tex</Typography>
            </Breadcrumbs>
          </Box>
          <SplitPane
            onChange={(size) => setEditorSize(size)}
            split="vertical"
            defaultSize="50%"
            primary="first"
          >
            <Editor editorSize={editorSize} />

            <TeXRenderer />
          </SplitPane>
        </div>
      </SplitPane>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
}
