const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('system', {
  scan: {
    fast: (ip) => ipcRenderer.invoke('scan:fast', ip)
  }
}) 