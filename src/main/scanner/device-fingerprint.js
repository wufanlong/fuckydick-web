// scanner/device-fingerprint.js

const CAMERA_PORTS = [554, 8000, 37777, 8080, 80];

function getVendorByMac(mac) {
  if (mac.startsWith('44:47:cc')) return 'Hikvision';
  if (mac.startsWith('c0:56:27')) return 'Dahua';
  return 'Unknown';
}

function fingerprint(device) {
  const { mac, openPorts } = device;
  const vendor = getVendorByMac(mac);

  let type = 'unknown';

  if (openPorts.includes(554)) {
    type = 'camera';
  }

  return {
    ...device,
    vendor,
    type
  };
}

module.exports = {
  CAMERA_PORTS,
  fingerprint
};
