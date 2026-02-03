import { ipcMain } from "electron";
import log from "electron-log/main";
import { isapiSDK } from "isapi-js-sdk";
import windowManager from "../../window/windowManager.ts";
import { batchCreateDevices } from '../../device/factory/index.ts'

ipcMain.handle("device:updateIsapiSDKInstance", (_event, ips) => {
  log.info('Updating ISAPI SDK instances for IPs:', ips);
  sdks.length = 0;
  sdks.push(...batchCreateDevices(ips));
});
ipcMain.handle("device:site", (_event, ip) => {
  
});

