const cmd = require('../../lib/awaitcmd');

module.exports = async function () {
	const id = 'bluetooth';
	const power = Number(await cmd(`bt-adapter -i | grep Powered | awk '{print $2}'`)) === 1;
	const discoverable = Number(await cmd(`bt-adapter -i | grep Discoverable | awk '{print $2}'`)) === 1;
	const devices = await Promise.all((await cmd(`bt-device -l | awk 'FNR>1 { print $1 }'`))
		.split('\n')
		.filter(Boolean)
		.map(async d => ({
			name: d,
			connected: Number(await cmd(`bt-device -i ${d} | grep Connected | awk '{print $2}'`)) === 1
		})));

	return { id, power, devices, discoverable };
}
