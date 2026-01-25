import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('system', {
  scan: {
    fast: (ip) => ipcRenderer.invoke('scan:fast', ip)
  },
  nmapScan: {
    fast: (ip) => ipcRenderer.invoke('nmapScan:fast', ip)
  },
  bootstrap: {
    isEnvsReady: () => ipcRenderer.invoke('bootstrap:isEnvsReady')
  },
  log: {
    setFileLogLevel: (level) => ipcRenderer.invoke('log:setFileLogLevel', level),
    setConsoleLogLevel: (level) => ipcRenderer.invoke('log:setConsoleLogLevel', level),
    loggingOnRenderer: (callback) => ipcRenderer.on('log:loggingOnRenderer', (_event, message) => {
      callback(message);
    })
  }
})