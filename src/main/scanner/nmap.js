import * as nmap from "node-nmap";
import path from "node:path";
let location = "";
if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
  location = path.join(__dirname, `../../extra/nmap/nmap.exe`);
} else {
  location = path.join(process.resourcesPath, 'nmap', 'nmap.exe');
}
nmap.nmapLocation = location;
export function NmapScan() {
  return new Promise((resolve, reject) => {
    let quickscan = new nmap.NmapScan("192.168.0.1/24", ['-n']);
    quickscan.on("complete", function (data) {
      resolve(data);
    });

    quickscan.on("error", function (error) {
      reject(error);
    });
    quickscan.startScan();
  });
}
