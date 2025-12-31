// import * as arp from "node-arp";

// export function scanArp() {
//   return new Promise((resolve, reject) => {
//     arp.getMAC("10.83.199.1", function (err, mac) {
//       if (!err) {
//         console.log(mac);
//         resolve(mac);
//       } else {
//         console.log("ARP 获取 MAC 地址失败:", err);
//         reject(err);
//       }
//     });
//   });
// }
/*4.0.0+ usage simply removes a layer of object nesting.
 * simply remove 'nodenmap'
 */
import * as nmap from "node-nmap";
import path from "node:path";
let location = "";
console.log(process.resourcesPath)
console.log(path.join(process.resourcesPath, 'nmap', 'nmap.exe'))
if (__dirname.includes(".vite")) {
  location = path.join(__dirname, `../../extra/nmap/nmap.exe`);
} else {
  location = path.join(process.resourcesPath, 'nmap', 'nmap.exe');
}
console.log(location);
nmap.nmapLocation = location;
export function scanArp() {
  return new Promise((resolve, reject) => {
    let quickscan = new nmap.QuickScan("127.0.0.1 google.com");
    quickscan.on("complete", function (data) {
      console.log(data);
      resolve(data);
    });

    quickscan.on("error", function (error) {
      console.log(error);
      reject(error);
    });
    quickscan.startScan();
  });
}
