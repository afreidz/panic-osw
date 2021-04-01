const crypto = require('crypto');
const fetch = require('node-fetch');
const config = require('../../config.proxy');

const api = {
	music: { token: null},
	devices: { token: null, expires: null, },
};

//setInterval(() => (api.music.token = null), 60000*5);

async function deviceToken() {
	const now = new Date();
	const { token, expires } = api.devices;

	if(token && now < expires) return token;

	const t = now.getTime();
	const sign_method = 'HMAC-SHA256';
	const client_id = config.devices.key;

	const { result } = await (await fetch(`${config.devices.url}/token?grant_type=1`, {
		method: 'get',
		headers: {
			t,
			client_id,
			sign_method,
			sign: sign(client_id, config.devices.secret, t)
		}
	})).json();
	api.devices.token = result.access_token;
	api.devices.expires = now.setSeconds(now.getSeconds() + result.expire_time);

	return api.devices.token;
}

async function musicToken() {
	if(!!api.music.token) return api.music.token;

	const body = new URLSearchParams();
	body.append('grant_type', 'refresh_token');
	body.append('refresh_token', config.music.refresh);

	const resp = await fetch(`${config.music.auth}/api/token`, {
		body,
		method: 'POST',
		headers: { 'Authorization': `Basic ${Buffer.from(`${config.music.key}:${config.music.secret}`).toString('base64')}` },
	});

	const { access_token } = await resp.json();

	api.music.token = access_token;
	return access_token;
}

function sign(base, secret, t) {
	const str = base + t;
	const hash = crypto
		.createHmac('sha256', secret)
		.update(str)
		.digest('hex')
		.toUpperCase();
	return hash;
}

exports.device = deviceToken;
exports.music = musicToken;
exports.sign = sign;
