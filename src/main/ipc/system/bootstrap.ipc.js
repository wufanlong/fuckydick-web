import { ipcMain } from "electron";
import { isEnvsReady } from "../../bootstrap/app.bootstrap.js";

ipcMain.handle("bootstrap:isEnvsReady", async (_event) => {
  return isEnvsReady();
});
