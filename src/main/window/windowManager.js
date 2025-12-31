import { BrowserWindow } from "electron";
import { createWindow as createConfigWindow } from "./config.window.js";
import path from 'node:path'
const map = {};

export default {
  createWindow(options) {
    let window = new BrowserWindow(options);
    options.hash = options.hash || '';
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL + '/#' + options.hash);
    } else {
        window.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`), { hash: options.hash });
    }
    map[options.name] = window;
    return window;
  },
  getByName(name) {
    this.alive(name)
    return map[name];
  },
  alive(name) {
    if (!map[name] || map[name].isDestroyed()) {
        switch(name) {
            case 'configWindow':
                createConfigWindow();
                break;
        }
    }
  }
};
