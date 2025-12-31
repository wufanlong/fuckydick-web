// scanner/port.js
const net = require('net');

function checkPort(ip, port, timeout = 300) {
  return new Promise(resolve => {
    const socket = new net.Socket();
    let done = false;

    const finish = (result) => {
      if (!done) {
        done = true;
        socket.destroy();
        resolve(result);
      }
    };

    socket.setTimeout(timeout);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));

    socket.connect(port, ip);
  });
}

async function scanPorts(ip, ports) {
  const openPorts = [];

  for (const port of ports) {
    if (await checkPort(ip, port)) {
      openPorts.push(port);
    }
  }

  return openPorts;
}

module.exports = {
  scanPorts
};
