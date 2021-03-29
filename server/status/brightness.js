const cmd = require('../../lib/awaitcmd');

module.exports = async function() {
	const id = 'brightness';
	let enabled = true;

	const values = (await cmd(`xrandr --verbose | grep -i brightness | awk '{print $2}'`))
		.split('\n')
		.filter(Boolean);

	let brightness = Math.min.apply(Math, values);

	if(!isFinite(brightness)) {
		brightness = 1;
		enabled = false;
	}

	return { id, brightness, enabled };
}