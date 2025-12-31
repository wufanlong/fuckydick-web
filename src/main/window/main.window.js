import path from "node:path";
import { app, BrowserWindow } from "electron";
import windowManager from "./windowManager.js";

const createWindow = () => {
  let options = {
    name: "mainWindow",
    width: 1920,
    height: 1080,
    fullscreen: false,
    icon: path.join(__dirname, "../../../public/icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  };
  const window = windowManager.createWindow(options);
  // 启动时最大化
  window.maximize();

  // Open the DevTools.
  window.webContents.openDevTools({ mode: 'detach' });
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
