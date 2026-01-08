const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('device', {
    updateIsapiSDKInstance: (devices) => ipcRenderer.invoke('device:updateIsapiSDKInstance', devices)
})