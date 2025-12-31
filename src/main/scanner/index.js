// scanner/index.js
const { scanArp } = require('./arp');
const { scanPorts } = require('./port');
const { scanSSDP } = require('./ssdp');
const { CAMERA_PORTS, fingerprint } = require('./device-fingerprint');

async function scanNetwork() {
  console.log('🔍 ARP 扫描中...');
  const arpDevices = await scanArp();

  console.log(`📡 发现 ${arpDevices.length} 台设备`);

  const results = [];

  for (const dev of arpDevices) {
    const openPorts = await scanPorts(dev.ip, CAMERA_PORTS);

    results.push(
      fingerprint({
        ...dev,
        openPorts
      })
    );
  }

  console.log('📢 SSDP 探测中...');
  const ssdpDevices = await scanSSDP();

  // 合并 SSDP 信息
  results.forEach(d => {
    const match = ssdpDevices.find(s => s.ip === d.ip);
    if (match) {
      d.ssdp = match;
    }
  });

  return results;
}

module.exports = {
  scanNetwork
};
