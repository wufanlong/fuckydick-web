const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('device', {
    updateIsapiSDKInstance: (devices) => ipcRenderer.invoke('device:updateIsapiSDKInstance', devices),
    onDeviceInfoUpdate: (callback) => ipcRenderer.on('deviceInfo:update', (_event, deviceInfo) => callback(deviceInfo))
})