const loudness = require('loudness');

module.exports = async function getVolume() {
	const id = 'volume';
	const vol = await loudness.getVolume();
	return { id, vol };
}