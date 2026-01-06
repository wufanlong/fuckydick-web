const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  common: {
    call: (fName, ip) => ipcRenderer.invoke('common:call', fName, ip)
  },
})