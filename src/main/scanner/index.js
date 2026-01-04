import { NmapScan } from "./nmap.js";
export async function fastScan(ip) {
  const devices = await NmapScan(ip);
  return devices;
}
