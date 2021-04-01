const config = require('../../config.proxy');

module.exports = async function() {
	return { id: 'widgets', devices: config.secretstuff }
}
