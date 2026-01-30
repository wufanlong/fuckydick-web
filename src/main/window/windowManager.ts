import { BrowserWindow } from "electron";
import { createWindow as createConfigWindow } from "./config.window.ts";
import { createWindow as createLogWindow } from "./log.window.ts";
import path from "node:path";
import { windowsGlobalOptions } from "../config/app.config.ts";
const map = {};

export default {
  createWindow(options) {
    // 引入全局配置
    Object.assign(options, windowsGlobalOptions);
    let window = new BrowserWindow(options);
    options.hash = options.hash || "";
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL + "/#" + options.hash);
    } else {
      window.loadFile(
        path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
        { hash: options.hash }
      );
    }
    map[options.name] = window;
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
      }
    }
  },
  isAlive(name: string) {
    return map[name] ? !map[name].isDestroyed() : false
  }
};
