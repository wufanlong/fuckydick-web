import { ipcMain } from "electron";
import { fastScan, nmapFastScan, scanAll } from "../../scanner/index.ts";

ipcMain.handle("scan:fast", async (_event, ips) => {
  return new Promise((resolve, reject) => {
    resolve(fastScan(ips));
  });
});
ipcMain.handle("scan:scanAll", async (_event, ips) => {
  return new Promise((resolve, reject) => {
    resolve(scanAll(ips));
  });
});

ipcMain.handle("nmapScan:fast", async (_event, ips) => {
  return new Promise((resolve, reject) => {
    resolve(nmapFastScan(ips));
  });
});
