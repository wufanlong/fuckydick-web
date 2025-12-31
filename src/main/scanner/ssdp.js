// scanner/ssdp.js
const { Client } = require('node-ssdp');

function scanSSDP(timeout = 3000) {
  return new Promise(resolve => {
    const client = new Client();
    const devices = [];

    client.on('response', (headers, statusCode, rinfo) => {
      devices.push({
        ip: rinfo.address,
        server: headers.SERVER,
        st: headers.ST,
        usn: headers.USN,
        location: headers.LOCATION
      });
    });

    client.search('ssdp:all');

    setTimeout(() => {
      client.stop();
      resolve(devices);
    }, timeout);
  });
}

module.exports = {
  scanSSDP
};
