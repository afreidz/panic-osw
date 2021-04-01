const cmd = require('../../lib/awaitcmd');

async function speed () {
	const results = JSON.parse(await cmd(`npx speed-test -j`));
	return {
		timestamp: new Date,
		upload: results.upload,
		download: results.download,
	};
}

module.exports = { speed };
