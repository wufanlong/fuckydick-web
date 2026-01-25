import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('api', {
  common: {
    call: (ip, fName) => ipcRenderer.invoke('common:call', ip, fName)
  },
})