import { NmapScan } from "./nmap.js";
import { isapiSDK } from 'isapi-js-sdk';
// export async function fastScan(ip) {
//   const devices = await NmapScan(ip);
//   return devices;
// }
export async function fastScan(ip) {
  const devices = await NmapScan(ip);
  return devices;
}
