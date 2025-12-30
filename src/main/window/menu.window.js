const { Menu, app, MenuItem } = require("electron");

app.whenReady().then(() => {
  setAppMenu();
});

function setAppMenu() {
  const template = [];
  const defaultMenu = Menu.getApplicationMenu();
  defaultMenu.append(new MenuItem({ label: "摄像头", type: "submenu", submenu: [] }));
  if (defaultMenu) {
    // 将默认菜单模板转换为可修改的 JS 对象
    template = defaultMenu.items.map((item) => console.log(item));
  }
  template.push({
    label: "摄像头",
    submenu: [
      {
        label: "扫描设备",
        click: () => {
          mainWindow.webContents.send("camera:scan"); // 触发 renderer 或 preload
        },
      },
      {
        label: "刷新流",
        click: () => {
          mainWindow.webContents.send("camera:refresh");
        },
      },
    ],
  });
  const menu = Menu.getApplicationMenu().push(Menu.buildFromTemplate(template));
  Menu.setApplicationMenu(menu);
}
