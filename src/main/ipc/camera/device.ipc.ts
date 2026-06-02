import { ipcMain } from "electron";
import log from "electron-log/main";
import windowManager from "../../window/windowManager.ts";
import { batchCreateDevices, createDevice } from "../../device/factory/index.ts";

ipcMain.handle("device:createIsapiSDKInstance", (_event, ip, password) => {
  log.info("creating ISAPI SDK instances for IP:", ip, password);
  createDevice(ip, password)
});
ipcMain.handle("device:updateIsapiSDKInstance", (_event, ips) => {
  log.info("Updating ISAPI SDK instances for IPs:", ips);
  batchCreateDevices(ips)
});
ipcMain.handle("device:site", (_event, ip) => {
  const window = windowManager.getByName(ip);
  window.show();
  window.focus();
});
