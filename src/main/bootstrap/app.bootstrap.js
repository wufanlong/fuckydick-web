const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const regedit = require('regedit');


// 执行 npcap 安装程序
function runNpcapInstaller() {
    // 注册表中查找是否有相应的值
    regedit.list('HKLM\\SOFTWARE\\WOW6432Node\\Npcap', (err, result) => {
        const install = () => {
            let installerPath;
            if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
                installerPath = path.join(__dirname, '../../extra/npcap-1.85.exe');
            } else {
                installerPath = path.join(__dirname, 'resources', 'npcap-1.85.exe')
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
            console.error(`Error: ${err}`);
            install()
        }
        if (!result['HKLM\\SOFTWARE\\WOW6432Node\\Npcap'].exists) {
            install()
        }
    });
};

app.whenReady().then(() => {
    // 先运行 npcap 安装程序
    runNpcapInstaller();
});