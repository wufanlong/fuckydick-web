import log from 'electron-log/main';
import path from 'path';
import { app } from 'electron'
import { fileURLToPath } from 'url';
import fs from 'fs';
import windowManager from '../window/windowManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.whenReady().then(() => {
  log.initialize();
  const logDir = path.join(__dirname, '../logs');

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  log.transports.file.resolvePathFn = () =>
    path.join(logDir, 'app.log');

  log.transports.sendToRenderer = (message) => {
    message = formatElectronLogMessage(message);
    windowManager.getByName("mainWindow").webContents.send("log:loggingOnRenderer", message);
  }

  log.transports.sendToRenderer.level = 'info'
  log.transports.file.level = 'info';
  log.transports.console.level = 'debug';

  log.info('Electron logger initialized');
});

function formatElectronLogMessage(msg) {
  // 1. 时间格式化 yyyy-MM-dd HH:mm:ss.SSS
  const d = new Date(msg.date);

  const pad = (n, len = 2) => String(n).padStart(len, '0');

  const time =
    `${d.getFullYear()}-` +
    `${pad(d.getMonth() + 1)}-` +
    `${pad(d.getDate())} ` +
    `${pad(d.getHours())}:` +
    `${pad(d.getMinutes())}:` +
    `${pad(d.getSeconds())}.` +
    `${pad(d.getMilliseconds(), 3)}`;

  // 2. level
  const level = msg.level;

  // 3. data 拼接（模拟 console.log 行为）
  const content = msg.data
    .map(item => {
      if (typeof item === 'string') return item;
      if (typeof item === 'number') return String(item);
      try {
        return JSON.stringify(item);
      } catch {
        return '[Object]';
      }
    })
    .join(' ');

  // 4. 最终格式
  return `[${time}] [${level}]  ${content}`;
}

export default log;