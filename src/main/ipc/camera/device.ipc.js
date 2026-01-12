import { ipcMain } from "electron";
import log from "electron-log/main";
import { isapiSDK } from "isapi-js-sdk";
import windowManager from "../../window/windowManager.js";

const sdks = [];

ipcMain.handle("device:updateIsapiSDKInstance", (_event, ips) => {
  sdks.length = 0;
  for (let i = 0; i < ips.length; i++) {
    const ip = ips[i];
    const sdk = new isapiSDK(ip, "admin", "sszx123456");
    sdk.init();
    sdks.push(sdk);
    sdk.on("deviceInitd", (DeviceInfo) => {
      DeviceInfo.ip = ip;
      windowManager
        .getByName("mainWindow")
        .webContents.send("deviceInitd", DeviceInfo);
    });
    sdk.on('initFailed', (err) => {
      log.error(`SDK init failed for IP ${ip}:`, err.message);
      log.debug(`SDK init failed for IP ${ip}:`, err);
      windowManager
        .getByName("mainWindow")
        .webContents.send("deviceInitFailed", ip);
    });
  }
});

export function getSDKByIP(ip) {
  return sdks.find((sdk) => sdk.ip === ip);
}
