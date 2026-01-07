import { ipcMain } from "electron";
import {isapiSDK} from 'isapi-js-sdk'
import log from 'electron-log/main'
ipcMain.handle("common:call", (_event, fName, ip) => {
    const sdk = new isapiSDK(ip, 'admin', 'sszx123456')
    if (fName === 'securityCapabilities') {
        return sdk.core.security.getSecurityCapabilities()
    }
});