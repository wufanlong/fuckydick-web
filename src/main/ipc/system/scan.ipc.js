const { ipcMain } = require('electron')

ipcMain.handle('camera:scanDevices', async () => {
  return new Promise((resolve, reject) => {
    const devices = []
    devices.push({ id: '1', name: 'Hikvision-Cam1', ip: '192.168.1.100' })
    devices.push({ id: '2', name: 'Dahua-Cam1', ip: '192.168.1.101' })

    // 延迟模拟扫描
    setTimeout(() => resolve(devices), 1000)
  })
})
