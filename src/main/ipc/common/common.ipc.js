import { ipcMain } from "electron";
import log from 'electron-log/main'
import { getSDKByIP } from "../../device/factory/index.js";

ipcMain.handle("common:call", (_event, ip, fName) => {
    const sdk = getSDKByIP(ip)
    if (fName === 'securityCapabilities') {
        return sdk.core.security.getSecurityCapabilities()
    } else if (fName === 'systemDeviceInfo') {
        return sdk.core.system.getSystemDeviceInfo()
    } else if (fName === 'getSystemNetworkInterfaces') {
        return sdk.core.system.getSystemNetworkInterfaces()
    } else if (fName === 'activate') {
        return sdk.core.system.activate()
    }
});