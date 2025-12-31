import log from 'electron-log';

// 配置日志（例如日志级别，文件路径等）
log.transports.file.level = 'info'; // 设置日志文件的最低级别
log.transports.console.level = 'debug'; // 设置控制台的最低级别

// 写入不同级别的日志
log.info('This is an info message');
log.warn('This is a warning message');
log.error('This is an error message');

// 主进程使用：
log.info('Main process started');

// 渲染进程使用：
log.info('Renderer process started');
