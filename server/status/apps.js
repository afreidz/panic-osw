const ini = require('ini');
const path = require('path');
const fs = require('fs/promises');
const cmd = require('../../lib/awaitcmd');
const logger = require('../../lib/logger');
const id = 'apps';

async function get() {
	const paths = (await cmd(`find /usr/share/applications ~/.local/share/applications /var/lib/snapd/desktop -name '*.desktop'`))
		.split('\n')
		.filter(Boolean);

	const apps = [];

	for (const p of paths) {
		const data = ini.parse(await fs.readFile(p, 'utf8'))['Desktop Entry'];
		if (data && data.NoDisplay !== true) {
			data._exec = path.basename(p);
			apps.push(data);
		}
	}

	return { id, apps };
}

module.exports = get;