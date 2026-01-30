import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('stream', {
  camera: {
    scanDevices: () => ipcRenderer.invoke('camera:scanDevices')
  }
})