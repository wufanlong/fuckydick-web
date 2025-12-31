import { NmapScan } from "./nmap.js";
export async function fastScan() {
  const arpDevices = await NmapScan();
  return arpDevices;
}
