import windowManager from "./windowManager.ts";
import path from "node:path";
import fs from "fs";

export const createWindow = (ip: string) => {
  let loginScriptLocation: string;
  let previewScriptLocation: string;
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    loginScriptLocation = path.join(
      __dirname,
      `../../extra/scripts/hikivision.js`,
    );
    previewScriptLocation = path.join(
      __dirname,
      `../../extra/scripts/preview.js`,
    );
  } else {
    loginScriptLocation = path.join(
      process.resourcesPath,
      "scripts",
      "hikivision.js",
    );
    previewScriptLocation = path.join(
      process.resourcesPath,
      "scripts",
      "preview.js",
    );
  }
  let options: Electron.BrowserWindowConstructorOptions | undefined = {
    title: ip,
    width: 800,
    height: 600,
    fullscreen: false,
    parent: windowManager.getByName("mainWindow"),
    modal: false,
  };
  const window = windowManager.createWindow(options, ip);
  window.loadURL(`http://${ip}`);
  window.removeMenu();
  window.setResizable(true);
  // window.maximize();
  window.on("page-title-updated", (e) => {
    e.preventDefault();
  });
  window.on("close", (e) => {
    window.destroy();
  });

  // window.webContents.once("did-finish-load", () => {
  // });
  window.webContents.on("did-navigate", (_e, url) => {
    console.log(url)
    if (url.includes("preview") || url.includes("main")) {
      console.log("executeJavaScript")
      window.webContents.executeJavaScript(getScript(previewScriptLocation));
    } else if (url.includes("login")) {
      window.webContents.executeJavaScript(getScript(loginScriptLocation));
    }
  });

  window.webContents.openDevTools({ mode: "detach" });
};

function getScript(location: string): string {
  try {
    return fs.readFileSync(location, "utf-8");
  } catch (err) {
    console.error("读取 JS 文件失败", err);
    return "读取 JS 文件失败";
  }
}
