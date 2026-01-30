import { ipcMain } from "electron";
import { fastScan, nmapFastScan } from "../../scanner/index.ts";

ipcMain.handle("scan:fast", async (_event, ips) => {
  return new Promise((resolve, reject) => {
    resolve(fastScan(ips));
  });
});

ipcMain.handle("nmapScan:fast", async (_event, ips) => {
  return new Promise((resolve, reject) => {
    resolve(nmapFastScan(ips));
  });
});
