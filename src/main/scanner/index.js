import { NmapScan } from "./nmap.js";
import { ipcMain } from "electron";
import log from "electron-log/main";
import { isapiSDK } from "isapi-js-sdk";
import windowManager from "../window/windowManager.js";
import { batchCreateDevices } from '../device/factory/index.js'
import { parseRange } from '@network-utils/ip-range'
// export async function fastScan(ip) {
//   const devices = await NmapScan(ip);
//   return devices;
// }
export async function fastScan(ips) {
  batchCreateDevices(parseRange(ips))
}
