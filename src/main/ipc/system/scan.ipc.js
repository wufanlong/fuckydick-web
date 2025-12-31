import { ipcMain } from "electron";
import { fastScan } from "../../scanner/index.js";

ipcMain.handle("scan:fast", async () => {
  return new Promise((resolve, reject) => {
    resolve(fastScan());
  });
});
