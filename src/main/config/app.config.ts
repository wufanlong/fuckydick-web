import path from "node:path";
import { nativeTheme, app } from 'electron'

export const windowsGlobalOptions: Electron.BrowserWindowConstructorOptions = {
  webPreferences: {
    scrollBounce: true, // ⭐ 关键配置：启用弹性滚动
    preload: path.join(__dirname, "preload.js"),
  },
  icon: path.join(__dirname, "../../../public/icon.ico"),
  backgroundColor: "#EDEDED", // ⭐ 关键配置：窗口背景色
};

app.whenReady().then(() => {
  nativeTheme.themeSource = 'light';
});