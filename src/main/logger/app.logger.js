import log from 'electron-log/main';
import path from 'path';
import { app } from 'electron'
import { fileURLToPath } from 'url';
import fs from 'fs';

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

  log.transports.file.level = 'info';
  log.transports.console.level = 'debug';

  log.info('Electron logger initialized');
});

export default log;