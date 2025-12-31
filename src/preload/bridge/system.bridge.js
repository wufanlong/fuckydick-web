const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('system', {
  "camera": {
    scanDevices: () => ipcRenderer.invoke('camera:scanDevices')
  }
}) 