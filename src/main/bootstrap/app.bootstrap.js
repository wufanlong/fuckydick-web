import { app, BrowserWindow } from 'electron';
import path from 'path';
import { exec, spawn } from 'child_process';
import log from '../logger/app.logger.js'

let zlmProcess = null


function isNpcapIstalled() {
    return new Promise((resolve, reject) => {
        // 注册表中查找是否有相应的值
        exec('reg query "HKLM\\SOFTWARE\\WOW6432Node\\Npcap"', (err, stdout) => {
            if (err) {
                if (err.code === 1) {
                    log.info('未找到Npcap指定注册表路径:HKLM\\SOFTWARE\\WOW6432Node\\Npcap')
                    resolve(false)
                    return;
                } else if (err.code === 5) {
                    log.error('无权限访问Npcap指定注册表路径:HKLM\\SOFTWARE\\WOW6432Node\\Npcap')
                } else {
                    log.error("未知错误code=" + err.code)
                }
                reject(err)
            } else {
                resolve(true)
            }
        })
    })
}

// 执行 npcap 安装程序
function runNpcapInstaller() {
    const install = () => {
        let installerPath;
        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            installerPath = path.join(__dirname, '../../extra/npcap-1.85.exe');
        } else {
            installerPath = path.join(process.resourcesPath, 'npcap-1.85.exe')
        }
        log.info(installerPath)
        exec(installerPath, { 'shell': 'powershell.exe' }, (err, stdout, stderr) => {
            if (err) {
                console.error('Error installing npcap:', err);
            } else {
                console.log('Npcap installing');
            }
        })
    }
    isNpcapIstalled().then(response => {
        if (!response) {
            log.info("开始执行Npcap安装程序")
            install()
        } else {
            log.info("Npcap已安装")
        }
    }).catch(err => {
        log.error("err" + err)
    })
};

function runZLMediaKit() {
    if (zlmProcess) return

  // Electron resourcesPath 指向打包资源目录
  let zlmPath;
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      zlmPath = path.join(__dirname, '../../extra/ZLMediaKit/MediaServer.exe');
  } else {
      zlmPath = path.join(process.resourcesPath, 'ZLMediaKit/MediaServer.exe')
  }
  zlmProcess = spawn(zlmPath, [], {
    cwd: path.dirname(zlmPath),
    windowsHide: false // 不显示控制台
  })

  zlmProcess.stdout.on('data', (data) => {
    console.log('ZLM:', data.toString())
  })

  zlmProcess.stderr.on('data', (data) => {
    console.error('ZLM error:', data.toString())
  })

  zlmProcess.on('exit', () => {
    console.log('ZLMediaKit exited')
    zlmProcess = null
  })
}

export function isEnvsReady() {
    log.info("Environment ready status check initiated")
    const isZlmExist = zlmProcess ? true : false
    return isNpcapIstalled() && isZlmExist
}

app.whenReady().then(() => {
    runNpcapInstaller()
    runZLMediaKit()
})