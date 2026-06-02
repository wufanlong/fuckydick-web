import log from "electron-log/main";
import { isapiSDK } from "isapi-js-sdk";
import windowManager from "../../window/windowManager.ts";
import net from "net";

const sdks: Array<isapiSDK> = [];

export function createDevice(ip: string, password="sszx123456") {
  if (ip.startsWith("172.30.24.")) {
    password = "abc123456";
  }
  const sdk = new isapiSDK(ip, "admin", password);
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
  sdks.push(sdk);
}

export async function batchCreateDevices(ips: string[]) {
  sdks.length = 0

  const concurrency = 40
  let index = 0

  async function worker() {
    while (index < ips.length) {
      const ip = ips[index++]
      const open = await checkPort(ip, 80)

      if (open && !sdks.find(sdk => sdk.ip === ip)) {
        createDevice(ip)
      }
      await new Promise(r => setTimeout(r, 50))
    }
  }

  const workers = []
  for (let i = 0; i < concurrency; i++) {
    workers.push(worker())
  }

  await Promise.all(workers)

  return sdks
}

export function getSDKByIP(ip: string): isapiSDK {
  const sdk = sdks.find((sdk) => sdk.ip === ip);
  if (!sdk) {
    log.error(`SDK not found for IP ${ip}`);
    throw new Error(`SDK not found for IP ${ip}`);
  }
  return sdk;
}


function checkPort(ip: string, port = 80, timeout = 800): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(timeout);

    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });

    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });

    socket.once("error", () => {
      resolve(false);
    });

    socket.connect(port, ip);
  });
}
