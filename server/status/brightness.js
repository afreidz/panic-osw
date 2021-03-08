const cmd = require('../../lib/awaitcmd');

module.exports = async function() {
	const id = 'brightness';
	let enabled = true;
	let brightness;
	let command;

	if (process.platform === 'darwin') {
		command = `brightness -l | grep brightness | awk '{print $4}'`;
	} else if (process.platform === 'linux') {
		command = `xrandr --verbose | grep -i brightness | awk '{print $2}'`;
	}

	const values = (await cmd(command))
		.split('\n')
		.filter(Boolean);

	brightness = Math.min.apply(Math, values);

	if(!isFinite(brightness)) {
		brightness = 1;
		enabled = false;
	}

	return { id, brightness, enabled };
}