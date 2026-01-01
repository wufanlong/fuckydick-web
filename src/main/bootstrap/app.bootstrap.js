const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');


// 执行 npcap 安装程序
function runNpcapInstaller() {
    // 注册表中查找是否有相应的值
    exec('reg query "HKLM\\SOFTWARE\\WOW6432Node\\Npcap"', (err, result) => {
        const install = () => {
            let installerPath;
            if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
                installerPath = path.join(__dirname, '../../extra/npcap-1.85.exe');
            } else {
                installerPath = path.join(process.resourcesPath, 'npcap-1.85.exe')
            }
            exec(installerPath, { 'shell': 'powershell.exe' }, (err, stdout, stderr) => {
                if (err) {
                    console.error('Error installing npcap:', err);
                } else {
                    console.log('Npcap installing');
                }
            })
        }
        if (err) {
            if (err.code === 1) {
                console.log('未找到指定注册表路径')
                install()
            } else if (err.code === 5) {
                console.error('无权限访问指定注册表路径')
            } else {
                console.error("未知错误code=" + err.code)
            }
        }
    })
};

app.whenReady().then(() => {
    // 先运行 npcap 安装程序
    runNpcapInstaller();
});