import { ipcMain } from "electron";
import jsonfile from "jsonfile";
import path from "node:path";
import log from 'electron-log/main';
import * as XLSX from "xlsx"
import * as fs from 'fs';
XLSX.set_fs(fs);

let recordersPath, devicesPath: string
if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    recordersPath = path.join(__dirname, '../../extra/data/recorders.json');
    devicesPath = path.join(__dirname, '../../extra/data/devices.json');
} else {
    recordersPath = path.join(process.resourcesPath, 'data/recorders.json')
    devicesPath = path.join(process.resourcesPath, 'data/devices.json')
}
ipcMain.handle("data:exportToExcel", async (_event, json) => {
    const data = JSON.parse(json);
    const getHddStatus = (hdd) => {
        if (hdd.status === "notexist") {
            return "(不存在)"
        } else if(hdd.status === "unformatted") {
            return "(未格式化)"
        } else if (hdd.status === "error") {
            return "(出错)"
        } else if (hdd.status === "idle") {
            return "(休眠)"
        } else {
            return ""
        }
    }
    const rows = data.map(row => ({
        "IP": row.ip,
        "用户名": row.username,
        "密码": row.password,
        "设备名称": row.DeviceInfo?.deviceName,
        "通道名称": row.VideoInputChannel?.name,
        "子网掩码": row.NetworkInterfaceList?.NetworkInterface?.IPAddress?.subnetMask,
        "网关": row.NetworkInterfaceList?.NetworkInterface?.IPAddress?.DefaultGateway?.ipAddress,
        "设备型号": row.DeviceInfo?.model,
        "序列号": row.DeviceInfo?.serialNumber?.replace(row.DeviceInfo?.model, ''),
        "MAC地址": row.DeviceInfo?.macAddress,
        "设备类型": row.DeviceInfo?.deviceType,
        "通道数量": row.InputProxyChannelStatusList?.length,
        "平均回放天数": (row.trackDailyDistribution.map(track => track.dayList.day).flat(Infinity).filter(r => r.record).length / row.InputProxyChannelStatusList.length).toFixed(2) + "天",
        "硬盘容量": row.hddList?.hdd?.map(h => (h.capacity / 1024).toFixed(2) + "GB" + getHddStatus(h)).join(",")
    }));
    // 将数据转换为 worksheet 对象
    const worksheet = XLSX.utils.json_to_sheet(rows);
    // 将 worksheet 对象添加到 workbook 中
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    // 导出 Excel 文件
    XLSX.writeFile(workbook, `${Date.now()}.xlsx`);
});
