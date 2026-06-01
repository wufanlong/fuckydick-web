import { ipcMain } from "electron";
import jsonfile from "jsonfile";
import path from "node:path";
import log from 'electron-log/main';

let recordersPath: string
if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    recordersPath = path.join(__dirname, '../../extra/data/recorders.json');
} else {
    recordersPath = path.join(process.resourcesPath, 'data/recorders.json')
}
ipcMain.handle("config:readRecorderConfig", async (_event) => {
    log.info("读取录像机配置")
  return jsonfile.readFile(recordersPath);
});
ipcMain.handle("config:writeRecorderConfig", async (_event, config) => {
    log.info("写入录像机配置", config)
    return jsonfile.writeFile(recordersPath, config);
});
