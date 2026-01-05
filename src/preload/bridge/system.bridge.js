const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('system', {
  scan: {
    fast: (ip) => ipcRenderer.invoke('scan:fast', ip)
  },
  bootstrap: {
    isEnvsReady: () => ipcRenderer.invoke('bootstrap:isEnvsReady')
  },
  log: {
    setFileLogLevel: (level) => ipcRenderer.invoke('log:setFileLogLevel', level),
    setConsoleLogLevel: (level) => ipcRenderer.invoke('log:setConsoleLogLevel', level),
  }
})