import path from "node:path";
import windowManager from "./windowManager.js";

export const createWindow = () => {
  let options = {
    name: "configWindow",
    width: 800,
    height: 500,
    fullscreen: false,
    icon: path.join(__dirname, "../../../public/icon.ico"), // ← 这里指定图标
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    hash: 'config',
    parent: windowManager.getByName("mainWindow"),
    modal: false,
  };
  const window = windowManager.createWindow(options);  
  window.removeMenu();
};