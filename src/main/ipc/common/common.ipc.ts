import { ipcMain } from "electron";
import log from 'electron-log/main'
import { getSDKByIP } from "../../device/factory/index.ts";

ipcMain.handle("common:call", (_event, ip, fName, data) => {
    const sdk = getSDKByIP(ip)
    if (fName === 'securityCapabilities') {
        return sdk.core.security.getSecurityCapabilities()
    } else if (fName === 'systemDeviceInfo') {
        return sdk.core.system.getSystemDeviceInfo()
    } else if (fName === 'putDeviceInfo') {
        return sdk.core.system.putDeviceInfo(data)
    } else if (fName === 'getSystemNetworkInterfaces') {
        return sdk.core.system.getSystemNetworkInterfaces()
    } else if (fName === 'activate') {
        return sdk.core.system.activate()
    } else if (fName === 'reboot') {
        return sdk.core.system.reboot()
    } else if (fName === 'basicRestore') {
        return sdk.core.system.basicRestore()
    } else if (fName === 'fullRestore') {
        return sdk.core.system.fullRestore()
    }
});