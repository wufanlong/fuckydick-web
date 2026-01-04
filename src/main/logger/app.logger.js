import log from 'electron-log';

// 配置日志（例如日志级别，文件路径等）
log.transports.file.level = 'info'; // 设置日志文件的最低级别
log.transports.console.level = 'debug'; // 设置控制台的最低级别

window.log = log