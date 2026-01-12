const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('device', {
    updateIsapiSDKInstance: (devices) => ipcRenderer.invoke('device:updateIsapiSDKInstance', devices),
    onDeviceInitd: (callback) => ipcRenderer.on('deviceInitd', (_event, deviceInfo) => callback(deviceInfo)),
    onDeviceInitFailed: (callback) => ipcRenderer.on('deviceInitFailed', (_event, ip) => callback(ip))
})