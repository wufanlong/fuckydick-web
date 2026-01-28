import { ipcMain } from "electron";
import log from 'electron-log/main';

ipcMain.handle("log:setFileLogLevel", (_event, level) => {
    log.transports.file.level = level;
});
ipcMain.handle("log:setConsoleLogLevel", (_event, level) => {
    log.transports.console.level = level;
});
ipcMain.handle("log:getLog", (_event) => {
    return log.message;
})