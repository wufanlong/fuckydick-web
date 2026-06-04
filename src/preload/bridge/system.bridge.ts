import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('system', {
  scan: {
    fast: (ip) => ipcRenderer.invoke('scan:fast', ip),
    scanAll: (ips) => ipcRenderer.invoke('scan:scanAll', ips)
  },
  nmapScan: {
    fast: (ip) => ipcRenderer.invoke('nmapScan:fast', ip)
  },
  bootstrap: {
    isEnvsReady: () => ipcRenderer.invoke('bootstrap:isEnvsReady')
  },
  config: {
    writeRecorderConfig: (config) => ipcRenderer.invoke('config:writeRecorderConfig', config),
    readRecorderConfig: () => ipcRenderer.invoke('config:readRecorderConfig'),
    writeDeviceConfig: (config) => ipcRenderer.invoke('config:writeDeviceConfig', config),
    readDeviceConfig: () => ipcRenderer.invoke('config:readDeviceConfig'),
  },
  log: {
    setFileLogLevel: (level) => ipcRenderer.invoke('log:setFileLogLevel', level),
    setConsoleLogLevel: (level) => ipcRenderer.invoke('log:setConsoleLogLevel', level),
    loggingOnRenderer: (callback) => ipcRenderer.on('log:loggingOnRenderer', (_event, message) => {
      callback(message);
    }),
    getLog: () => ipcRenderer.invoke("log:getLog")
  }
})