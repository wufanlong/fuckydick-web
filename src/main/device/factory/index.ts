import log from "electron-log/main";
import { isapiSDK } from "isapi-js-sdk";
import windowManager from "../../window/windowManager.ts";

const sdks: Array<isapiSDK> = [];

export function createDevice(ip: string) {
  const sdk = new isapiSDK(ip, "admin", "sszx123456");
  sdk.init();
  sdk.on('deviceUpdated', (device) => {
    windowManager
      .getByName("mainWindow")
      .webContents.send("deviceUpdated", JSON.parse(JSON.stringify(device)));
  })
  sdk.on("initFailed", (err) => {
    if (err.code !== "ETIMEDOUT") {
        if (err.message !== "Socket timeout" && !err.error?.includes("connect ECONNREFUSED")) {
          log.error(`SDK init failed for IP ${ip}:`, err.message);
        } else {
          console.log(`SDK init failed for IP ${ip}:`, err.message || err.error)
        }
    } 
    windowManager
      .getByName("mainWindow")
      .webContents.send("deviceInitFailed", ip);
  });
  sdk.on("log:debug", (message) => {
    log.debug(message);
  });
  sdk.on("log:info", (message) => {
    log.info(message);
  });
  sdk.on("log:warn", (message) => {
    log.warn(message);
  });
  sdk.on("log:error", (message) => {
    log.error(message);
  });
  return sdk;
}
export function batchCreateDevices(ips: Array<string> | string) {
  sdks.length = 0;
  for (let i = 0; i < ips.length; i++) {
    sdks.push(createDevice(ips[i]));
  }
  return sdks;
}

export function getSDKByIP(ip: string) {
  return sdks.find((sdk) => sdk.ip === ip);
}
