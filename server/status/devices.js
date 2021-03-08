const fetch = require('node-fetch');
const tokens = require('../lib/tokens');
const config = require('../../config.proxy');
const { sign } = tokens;

module.exports = async function () {
	const id = 'device';
	
	const t = new Date().getTime();
	const sign_method = 'HMAC-SHA256';
	const client_id = config.devices.key;
	const access_token = await tokens.device();
	const ids = config.devices.configured.map(d => d.id).join(',');
	
	const devices = (await (await fetch(`${config.devices.url}/devices/status?device_ids=${ids}`,{
		method: 'get',
		headers: {
			t,
			client_id,
			sign_method,
			access_token,
			sign: sign((client_id+access_token), config.devices.secret, t),
		}
	})).json()).result;

	return { id, devices };
}