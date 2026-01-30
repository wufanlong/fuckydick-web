import * as nmap from "node-nmap";
import path from "node:path";
import log from "electron-log/main";
let location = "";
if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
  location = path.join(__dirname, `../../extra/nmap/nmap.exe`);
} else {
  location = path.join(process.resourcesPath, 'nmap', 'nmap.exe');
}
nmap.nmapLocation = location;
export function NmapScan(ips) {
  return new Promise((resolve, reject) => {
    // let quickscan = new nmap.NmapScan(ips, '-n -p 8000 --max-rate 100 --host-timeout 0');
    let quickscan = new nmap.NmapScan(ips, '-n -Pn -p 8000 --open --max-rate 100 --host-timeout 0');
    log.debug('nmap -oX -n -p 8000 --max-rate 100 --host-timeout 0')
    quickscan.on("complete", function (data) {
      resolve(data);
    });

    quickscan.on("error", function (error) {
      reject(error);
    });
    quickscan.startScan();
  });
}
