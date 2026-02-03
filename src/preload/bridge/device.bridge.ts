import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('device', {
    updateIsapiSDKInstance: (devices) => ipcRenderer.invoke('device:updateIsapiSDKInstance', devices),
    onDeviceUpdated: (callback) => ipcRenderer.on('deviceUpdated', (_event, deviceInfo) => callback(deviceInfo)),
    onDeviceInitFailed: (callback) => ipcRenderer.on('deviceInitFailed', (_event, ip) => callback(ip)),
    openSite: (ip) => ipcRenderer.invoke('device:site', ip)
})