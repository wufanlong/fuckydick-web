import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('api', {
  common: {
    call: (ip, fName, data) => ipcRenderer.invoke('common:call', ip, fName, data)
  },
})