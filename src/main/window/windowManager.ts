import { app, BrowserWindow } from "electron";
import { createWindow as createMainWindow } from "./main.window.ts";
import { createWindow as createConfigWindow } from "./config.window.ts";
import { createWindow as createLogWindow } from "./log.window.ts";
import { createWindow as createSiteWindow } from "./site.window.ts";
import log from 'electron-log'
import { windowsGlobalOptions } from "../config/app.config.ts";

const map: Record<string, BrowserWindow> = {};

app.whenReady().then(() => {
  createMainWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

export default {
  /**
   * 
   * @param options 
   * @returns 
   */
  createWindow(options: Electron.BrowserWindowConstructorOptions, name: string): BrowserWindow {
    // 引入全局配置
    Object.assign(options, windowsGlobalOptions);
    let window = new BrowserWindow(options);
    map[name] = window;
    return window;
  },
  getByName(name: string) {
    this.alive(name);
    return map[name];
  },
  alive(name: string) {
    if (!map[name] || map[name].isDestroyed()) {
      switch (name) {
        case "configWindow":
          createConfigWindow();
          break;
        case "logWindow":
          createLogWindow();
          break;
        default :
          createSiteWindow(name);
      }
    }
  },
  isAlive(name: string) {
    return map[name] ? !map[name].isDestroyed() : false
  }
};
