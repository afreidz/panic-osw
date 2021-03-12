const fs = require('fs/promises');
const cmd = require('../../lib/awaitcmd');
const { dirs, files } = require('../../consts');

async function update(values) {
	await fs.access(files.config).catch(async () => {
		await fs.mkdir(dirs.config).catch(_ => {});
		await fs.writeFile(files.config,'{}');
	});

	let existing = require(files.config);
	await fs.writeFile(files.config, JSON.stringify({ ...existing, ...values }, null, 2));
	return true;
}