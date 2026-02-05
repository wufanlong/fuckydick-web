import windowManager from "./windowManager.ts";
import path from "node:path";

export const createWindow = () => {
    let hash = "log"
  let options: Electron.BrowserWindowConstructorOptions = {
    width: 900,
    height: 500,
    title: "日志",
    fullscreen: false,
    parent: windowManager.getByName("mainWindow"),
    modal: false,
  };
  const window = windowManager.createWindow(options, 'logWindow');
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL + "/#" + hash);
  } else {
    window.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
      { hash },
    );
  }
  window.removeMenu();
  window.setResizable(false);
  window.on("page-title-updated", (e) => {
    e.preventDefault();
  });
  window.on("close", (e) => {
    window.destroy();
  });

  // window.webContents.openDevTools({ mode: 'detach' });
};
