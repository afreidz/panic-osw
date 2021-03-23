const cmd = require('../../lib/awaitcmd');
const { files } = require('../../consts');
const { platform } = process;

async function settings () {
	delete require.cache[require.resolve(files.config)];
	
	const id = 'settings';
	const settings = require(files.config);
	settings.values = settings.values || {};

	const interfaces = platform === 'linux'
		? (await cmd(`nmcli device status | awk 'FNR>1 {print $1}'`))
			.split('\n')
			.filter(Boolean)
		: platform === 'darwin'
			? (await cmd(`networksetup -listallhardwarereports | grep Device | awk {print $2}`))
				.split('\n')
				.filter(Boolean)
			: [];

	const users = platform === 'linux'
		? (await cmd(`getent passwd {1000..6000} | awk -F':' '{print $1}'`))
			.split('\n')
			.filter(Boolean)
		: null;

	settings.values.users = users;
	settings.values.platform = platform;
	settings.values.interfaces = interfaces;

	return { id, settings };
}

module.exports = settings;