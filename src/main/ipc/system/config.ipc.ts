import { ipcMain } from "electron";
import jsonfile from "jsonfile";
import path from "node:path";
import log from 'electron-log/main';
import { updateDevicesJson } from "../../device/factory/index.ts";

let recordersPath, devicesPath: string
if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    recordersPath = path.join(__dirname, '../../extra/data/recorders.json');
    devicesPath = path.join(__dirname, '../../extra/data/devices.json');
} else {
    recordersPath = path.join(process.resourcesPath, 'data/recorders.json')
    devicesPath = path.join(process.resourcesPath, 'data/devices.json')
}
ipcMain.handle("config:readRecorderConfig", async (_event) => {
    log.info("读取录像机配置")
    return jsonfile.readFile(recordersPath);
});
ipcMain.handle("config:writeRecorderConfig", async (_event, config) => {
    log.info("写入录像机配置", config)
    return jsonfile.writeFile(recordersPath, config);
});

ipcMain.handle("config:readDeviceConfig", async (_event) => {
    return readDeviceConfig();
});
ipcMain.handle("config:writeDeviceConfig", async (_event, config) => {
    updateDevicesJson(JSON.parse(config));
    return writeDeviceConfig(config);
});
export function readDeviceConfig() {
    log.info("读取设备配置")
    return jsonfile.readFile(devicesPath);
}

export function writeDeviceConfig(config: any) {
    log.info("写入设备配置")
    return jsonfile.writeFile(devicesPath, config);
}
