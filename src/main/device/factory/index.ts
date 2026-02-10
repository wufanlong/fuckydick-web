import log from "electron-log/main";
import { isapiSDK } from "isapi-js-sdk";
import windowManager from "../../window/windowManager.ts";

const sdks: Array<isapiSDK> = [];

export function createDevice(ip: string) {
  const sdk = new isapiSDK(ip, "admin", "sszx123456");
  try {
    sdk.init();
  } catch (err) {
  }
  sdk.on('deviceUpdated', (device) => {
    windowManager
      .getByName("mainWindow")
      .webContents.send("deviceUpdated", JSON.parse(JSON.stringify(device)));
  })
  sdk.on("initFailed", (err) => {
    if (err.code !== "ETIMEDOUT") {
        if (err.message !== "Socket timeout" && !err.error?.includes("connect ECONNREFUSED")) {
          log.error(`SDK init failed for IP ${sdk.ip}:`, err.message);
        } else {
          console.log(`SDK init failed for IP ${sdk.ip}:`, err.message || err.error)
        }
    } 
    windowManager
      .getByName("mainWindow")
      .webContents.send("deviceInitFailed", sdk.ip);
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

export function getSDKByIP(ip: string): isapiSDK {
  const sdk = sdks.find((sdk) => sdk.ip === ip);
  if (!sdk) {
    log.error(`SDK not found for IP ${ip}`);
    throw new Error(`SDK not found for IP ${ip}`);
  }
  return sdk;
}
