import windowManager from "./windowManager.ts";

export const createWindow = () => {
  let options = {
    name: "logWindow",
    width: 900,
    height: 500,
    title: "日志",
    fullscreen: false,
    hash: 'log',
    parent: windowManager.getByName("mainWindow"),
    modal: false,
  };
  const window = windowManager.createWindow(options);  
  window.removeMenu();
  window.setResizable(false)
  window.on('page-title-updated', (e) => {
    e.preventDefault();
  });
  window.on('close', e => {
    window.destroy()
  })

  // window.webContents.openDevTools({ mode: 'detach' });
};