// scanner/arp.js
const arp = require('node-arp');

function scanArp() {
  return new Promise((resolve, reject) => {
    arp.table((err, table) => {
      if (err) return reject(err);

      const devices = table
        .filter(item => item.ip && item.mac)
        .map(item => ({
          ip: item.ip,
          mac: item.mac.toLowerCase()
        }));

      resolve(devices);
    });
  });
}

module.exports = {
  scanArp
};
