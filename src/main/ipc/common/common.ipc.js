import { ipcMain } from "electron";
import ISAPIClient from 'isapi-js-client'
import log from 'electron-log/main'
import { getIV, encryptionKey, aes128Encrypt } from '../../utils/encryption.js'

ipcMain.handle("common:call", (_event, fName, ip) => {
    log.info(fName, ip)
    ISAPIClient.security.encryption.securityCapabilities()
    if (fName === 'securityCapabilities') {
        const password = 'sszx123456'
        const iv = getIV();
        const encrypted = aes128Encrypt(password, iv)
        return ISAPIClient.security.encryption.securityCapabilities(ip, {params:{username: 'admin',iv: iv.toString('hex'), password: encrypted, security: 1}})
    }
});