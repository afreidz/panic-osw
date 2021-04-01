const battery = require('battery-level');

module.exports = async function () {
	const id = 'battery';
	const level = await battery().catch(() => {
		return 999;
	});
	return { id, level };
}
