import { ipcMain } from "electron";
import log from 'electron-log/main'
import { getSDKByIP } from "../../device/factory/index.ts";
import { isapiSDK } from "isapi-js-sdk";

ipcMain.handle("common:call", (_event, ip, fName, data) => {
    const sdk: isapiSDK = getSDKByIP(ip)
    if (fName === 'putDeviceInfo') {
        return sdk.putDeviceInfo(data)
    } else if (fName === 'getSystemNetworkInterfaces') {
        return sdk.getSystemNetworkInterfaces()
    } else if (fName === 'activate') {
        return sdk.activate()
    } else if (fName === 'reboot') {
        return sdk.reboot()
    } else if (fName === 'basicRestore') {
        return sdk.basicRestore()
    } else if (fName === 'fullRestore') {
        return sdk.fullRestore()
    } else if (fName === 'setChannelNameByID') {
        return sdk.setChannelNameByID(undefined, data)
    } else if (fName === 'putNetworkByID') {
        return sdk.putNetworkByID(undefined, data)
    }
});