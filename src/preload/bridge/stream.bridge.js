const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('stream', {
  camera: {
    scanDevices: () => ipcRenderer.invoke('camera:scanDevices')
  }
})