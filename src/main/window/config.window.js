import path from "node:path";
import windowManager from "./windowManager.js";

export const createWindow = () => {
  let options = {
    name: "configWindow",
    width: 800,
    height: 500,
    title: "全局配置",
    fullscreen: false,
    icon: path.join(__dirname, "../../../public/icon.ico"), // ← 这里指定图标
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    hash: 'config',
    parent: windowManager.getByName("mainWindow"),
    modal: true,
  };
  const window = windowManager.createWindow(options);  
  window.removeMenu();
  window.setResizable(false)
  window.on('page-title-updated', (e) => {
    e.preventDefault();
  });
};