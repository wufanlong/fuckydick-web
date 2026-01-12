import log from "electron-log/main";
import { isapiSDK } from "isapi-js-sdk";
import windowManager from "../../window/windowManager.js";

const sdks = [];

export function createDevice(ip) {
  const sdk = new isapiSDK(ip, "admin", "sszx123456");
  sdk.init();
  sdk.on("deviceInitd", (DeviceInfo) => {
    DeviceInfo.ip = ip;
    windowManager
      .getByName("mainWindow")
      .webContents.send("deviceInitd", DeviceInfo);
  });
  sdk.on("initFailed", (err) => {
    if (err.code !== "ETIMEDOUT") {
        log.error(`SDK init failed for IP ${ip}:`, err.message);
    }
    // log.debug(`SDK init failed for IP ${ip}:`, err);
    windowManager
      .getByName("mainWindow")
      .webContents.send("deviceInitFailed", ip);
  });
  return sdk;
}
export function batchCreateDevices(ips) {
  const sdks = [];
  for (let i = 0; i < ips.length; i++) {
    sdks.push(createDevice(ips[i]));
  }
  return sdks;
}

export function getSDKByIP(ip) {
  return sdks.find((sdk) => sdk.ip === ip);
}
