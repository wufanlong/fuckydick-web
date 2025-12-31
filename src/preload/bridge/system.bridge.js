const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('system', {
  scan: {
    fast: () => ipcRenderer.invoke('scan:fast')
  }
}) 