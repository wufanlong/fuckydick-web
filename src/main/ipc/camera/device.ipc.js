import { ipcMain } from "electron";
import log from 'electron-log/main'
import { isapiSDK } from 'isapi-js-sdk'

const sdks = []

ipcMain.handle("device:updateIsapiSDKInstance", (_event, ips) => {
    sdks.length = 0
    ips.forEach(ip => {
        const sdk = new isapiSDK(ip, 'admin', 'sszx123456')
        sdks.push(sdk)
    });
});

export function getSDKByIP(ip) {
    return sdks.find(sdk => sdk.context.ip === ip)
}