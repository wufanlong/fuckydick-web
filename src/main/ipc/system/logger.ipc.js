import { ipcMain } from "electron";
import log from "../../logger/app.logger.js";
ipcMain.handle("log:setFileLogLevel", (_event, level) => {
    log.transports.file.level = level;
});
ipcMain.handle("log:setConsoleLogLevel", (_event, level) => {
    log.transports.console.level = level;
});