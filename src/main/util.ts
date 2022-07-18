/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';
import { dialog } from 'electron';
import * as fs from 'fs';

export interface FileObject {
  path: string;
  content: string;
}

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

export const FileOp = {
  filePath: '',
  openFile: async (
    _menuItem: Electron.MenuItem,
    browserWindow: Electron.BrowserWindow | undefined
  ) => {
    const files = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'TeX', extensions: ['tex'] }],
    });

    if (!files || !browserWindow) return;

    const fileContentArray: Array<FileObject> = [];

    files.filePaths.forEach((file) => {
      const fileContent = fs.readFileSync(file).toString();

      fileContentArray.push({ path: file, content: fileContent });
    });

    FileOp.filePath = fileContentArray[0].path;

    browserWindow.webContents.send('fileOpen', fileContentArray);
  },
  newFile: async (
    _menuItem: Electron.MenuItem,
    browserWindow: Electron.BrowserWindow | undefined
  ) => {
    if (!browserWindow) return;

    FileOp.filePath = '';

    browserWindow.webContents.send('fileNew');
  },
  saveFile: async (
    _menuItem: Electron.MenuItem,
    browserWindow: Electron.BrowserWindow | undefined
  ) => {
    if (!browserWindow) return;

    if (FileOp.filePath === '') {
      const response = await dialog.showSaveDialog(browserWindow, {
        filters: [{ name: 'TeX files', extensions: ['tex'] }],
      });

      if (response.canceled) return;

      FileOp.filePath = response.filePath as string;
    }

    browserWindow.webContents.send('fileSave', FileOp.filePath);
  },
  saveFileAs: async (
    _menuItem: Electron.MenuItem,
    browserWindow: Electron.BrowserWindow | undefined
  ) => {
    if (!browserWindow) return;

    const response = await dialog.showSaveDialog(browserWindow, {
      filters: [{ name: 'TeX files', extensions: ['tex'] }],
    });

    if (response.canceled) return;

    FileOp.filePath = response.filePath as string;

    browserWindow.webContents.send('fileSave', FileOp.filePath);
  },
};
