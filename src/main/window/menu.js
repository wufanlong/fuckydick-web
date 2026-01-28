import { Menu, app, MenuItem } from 'electron'
import windowManager from "./windowManager.js";

let mainWindow;

const menuConfigList = [
  {
    label: "摄像头",
    submenu: [
      {
        label: "扫描设备",
        click: () => {
          mainWindow.webContents.send("camera:scan");
        },
      },
      {
        label: "刷新流",
        click: () => {
          mainWindow.webContents.send("camera:refresh");
        },
      },
    ],
  },
  {
    label: "全局配置",
    click: () => {
      const configWindow = windowManager.getByName("configWindow");
      configWindow.show();
      configWindow.focus();
    },
  },
  {
    label: "日志",
    click: () => {
      const logWindow = windowManager.getByName("logWindow");
      logWindow.show();
      logWindow.focus();
    },
  },
];

app.whenReady().then(() => {
  setAppMenu();
});

function setAppMenu() {
  mainWindow = windowManager.getByName("mainWindow");
  const menu = Menu.getApplicationMenu();
  menuConfigList.forEach((menuConfig) => {
    menu.append(new MenuItem(menuConfig));
  });
  Menu.setApplicationMenu(menu);
}
