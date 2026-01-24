import { NmapScan } from "./nmap.js";
import log from "electron-log/main";
import { batchCreateDevices } from '../device/factory/index.js'
import { parseRange } from '@network-utils/ip-range'
export async function nmapFastScan(ip) {
  const devices = await NmapScan(ip);
  return devices;
}
export async function fastScan(ips) {
  const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
  batchCreateDevices(ipv4Regex.test(ips) ? [ips] : parseRange(ips))
}
