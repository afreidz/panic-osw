const fetch = require('node-fetch');
const tokens = require('../lib/tokens');
const deviceStatus = require('../status/devices');
const { devices } = require('../../config.proxy');
const logger = require('../../lib/logger');
const statusToCmdMap = { 1: 2, 2: 3, 3: 4, 4: 1 };
const { sign } = tokens;

async function deviceCommand(device, commands) {
  const time = new Date().getTime();
  const token = await tokens.device();
  const response = await (await fetch(`${devices.url}/devices/${device}/commands`, {
    method: 'POST',
    headers: {
      t: time,
      access_token: token,
      client_id: devices.key,
      sign_method: 'HMAC-SHA256',
      sign: sign((devices.key + token), devices.secret, time),
    },
    body: JSON.stringify({ commands }),
  })).json();
  logger.log('Device Response: ', response);
  return !!response.success;
}

async function toggle (opts) {
	if (!opts.device) return false;

	const { device, spot } = opts;
  const code = spot ? `switch_${statusToCmdMap[spot]}` : `switch_1`;
  const status = await deviceStatus();

  if (spot) {
    const { value } = status.devices[device].find(s => s.code === `switch_${spot}`);
    const code = `switch_${statusToCmdMap[spot]}`;
    const success = await deviceCommand(device, [{ code, value: !value }]);
    return success;
  } else {
    const code = 'switch_1';
    const value = status.devices[device][0].value;
    const success = await deviceCommand(device, [{ code, value: !value }]);
    return success;
  }
}

module.exports = { toggle }

