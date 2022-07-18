export {};
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        myPing: () => void;
        saveFile: (filePath: string, fileContent: string) => void;
        // eslint-disable-next-line @typescript-eslint/ban-types
        on: (channel: string, func: Function) => void;
        // eslint-disable-next-line @typescript-eslint/ban-types
        once: (channel: string, func: Function) => void;
      };
    };
  }
}
