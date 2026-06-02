import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('device', {
    createIsapiSDKInstance: (ip, password) => ipcRenderer.invoke('device:createIsapiSDKInstance', ip, password),
    updateIsapiSDKInstance: (ips) => ipcRenderer.invoke('device:updateIsapiSDKInstance', ips),
    onDeviceUpdated: (callback) => {
        const handler = (_event, deviceInfo) => {
            callback(deviceInfo)
        }
        ipcRenderer.on('deviceUpdated', handler)
        return () => {
            ipcRenderer.removeListener('deviceUpdated', handler)
        }
    },
    onDeviceInitFailed: (callback) => {
        const handler = (_event, ip) => {
            callback(ip)
        }
        ipcRenderer.on('deviceInitFailed', handler)
        return () => {
            ipcRenderer.removeListener('deviceInitFailed', handler)
        }
    },
    openSite: (ip) => ipcRenderer.invoke('device:site', ip)
})