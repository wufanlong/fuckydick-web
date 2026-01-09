import { ipcMain } from "electron";
import log from "electron-log/main";
import { isapiSDK } from "isapi-js-sdk";
import windowManager from "../../window/windowManager.js";

const sdks = [];

ipcMain.handle("device:updateIsapiSDKInstance", (_event, ips) => {
  sdks.length = 0;
  ips.forEach((ip) => {
    const sdk = new isapiSDK(ip, "admin", "sszx123456");
    sdk.init();
    sdks.push(sdk);
    sdk.on("deviceInitd", (DeviceInfo) => {
      DeviceInfo.ip = ip;
      windowManager
        .getByName("mainWindow")
        .webContents.send("deviceInitd", DeviceInfo);
    });

  });
});

export function getSDKByIP(ip) {
  return sdks.find((sdk) => sdk.ip === ip);
}
