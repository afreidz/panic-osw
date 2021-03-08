const cmd = require('../../lib/awaitcmd');

module.exports = async function () {
	let power, devices, discoverable;
	const id = 'bluetooth';

	if (process.platform === 'darwin') {
		//brew install blueutil
		power = Number(await cmd(`blueutil -p`)) === 1;
		devices = JSON.parse(await cmd(`blueutil --paired --format json`));
		discoverable = Number(await cmd(`blueutil -d`)) === 1;
	} else if (process.platform === 'linux') {
		power = Number(await cmd(`bt-adapter -i | grep Powered | awk '{print $2}'`)) === 1;
		discoverable = Number(await cmd(`bt-adapter -i | grep Discoverable | awk '{print $2}'`)) === 1;
		devices = await Promise.all((await cmd(`bt-device -l | awk 'FNR>1 { print $1 }'`))
			.split('\n')
			.filter(Boolean)
			.map(async d => ({
				name: d,
				connected: Number(await cmd(`bt-device -i ${d} | grep Connected | awk '{print $2}'`)) === 1
			})));
	}

	return { id, power, devices, discoverable };
}