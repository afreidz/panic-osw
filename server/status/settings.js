const cmd = require('../../lib/awaitcmd');
const { files } = require('../../consts');

async function settings () {
	delete require.cache[require.resolve(files.config)];
	
	const settings = require(files.config);
	const values = {};

	const interfaces = (await cmd(`nmcli device status | awk 'FNR>1 {print $1}'`))
		.split('\n')
		.filter(Boolean);

	const users = (await cmd(`getent passwd {1000..6000} | awk -F':' '{print $1}'`))
		.split('\n')
		.filter(Boolean);

	values.users = users;
	values.interfaces = interfaces;

	return { settings, values };
}

module.exports = settings;