import windowManager from "./windowManager.ts";
import path from "node:path";
import { Menu, MenuItem, BrowserWindow } from 'electron'

let window: BrowserWindow;

const menuConfigList = [
  {
    label: "日志",
    click: () => {
      const logWindow = windowManager.getByName("logWindow");
      logWindow.show();
      logWindow.focus();
    },
  },
];

export const createWindow = () => {
  let options: Electron.BrowserWindowConstructorOptions = {
    width: 1920,
    height: 1080,
  };
  window = windowManager.createWindow(options, "mainWindow");

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL + "/#");
  } else {
    window.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
      { hash: '' },
    );
  }
  // 启动时最大化
  window.maximize();
  setAppMenu()
  window.show();
  // Open the DevTools.
  window.webContents.openDevTools({ mode: 'detach' });
};

function setAppMenu() {
  const menu = Menu.getApplicationMenu();
  if (menu) {
    menuConfigList.forEach((menuConfig) => {
      menu.append(new MenuItem(menuConfig));
    });
    Menu.setApplicationMenu(menu);
  }
}
