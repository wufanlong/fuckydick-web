import windowManager from "./windowManager.ts";

export const createWindow = () => {
  let options = {
    name: "configWindow",
    width: 800,
    height: 500,
    title: "全局配置",
    fullscreen: false,
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

  // window.webContents.openDevTools({ mode: 'detach' });
};