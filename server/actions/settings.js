const fs = require('fs/promises');
const cmd = require('../../lib/awaitcmd');
const logger = require('../../lib/logger');
const { dirs, files } = require('../../consts');

async function update(data) {
	const values = { ...data.settings };
	await fs.access(files.config).catch(async () => {
		await fs.mkdir(dirs.config).catch(_ => {});
		await fs.writeFile(files.config,'{}');
	});
	delete require.cache[require.resolve(files.config)];
	delete values.values;

	let existing = require(files.config);
	await fs.writeFile(files.config, JSON.stringify({ ...existing, ...values }, null, 2));
	return true;
}

module.exports = { update };