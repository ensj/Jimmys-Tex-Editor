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

export const MenuUtils = {
  openFile: async (
    menuItem: Electron.MenuItem,
    browserWindow: Electron.BrowserWindow | undefined,
    event: Electron.KeyboardEvent
  ) => {
    const files = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'TeX', extensions: ['tex'] }],
    });

    if (!files) return;

    const fileContentArray: Array<FileObject> = [];

    files.filePaths.forEach((file) => {
      const fileContent = fs.readFileSync(file).toString();

      fileContentArray.push({ path: file, content: fileContent });
    });

    (browserWindow as Electron.BrowserWindow).webContents.send(
      'fileOpen',
      fileContentArray
    );
  },
};
