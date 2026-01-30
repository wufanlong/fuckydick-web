import { ipcMain } from "electron";
import { isEnvsReady } from "../../bootstrap/app.bootstrap.ts";

ipcMain.handle("bootstrap:isEnvsReady", async (_event) => {
  return isEnvsReady();
});
