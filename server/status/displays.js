const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const cmd = require('../../lib/awaitcmd');
const logger = require('../../lib/logger');
const config = require('../../config.proxy');

async function streamWallpaper (i) {
	const noop = Readable.from([null]);

	if (process.platform === 'darwin') {
		const wallpapers = (await cmd(`desktoppr`))
			.split('\n')
			.filter(Boolean);

		const wallpaper = wallpapers.length === 1
			? wallpapers[0]
			: wallpapers[i];

		const ext = path.extname(wallpaper);

		if (['.heic', '.heif'].includes(ext)) {
			return noop
		} else {
			return fs.createReadStream(wallpaper);
		}
	} else if (process.platform === 'linux') {
		const wallpapers = config.feh
			? (await cmd(`cat ~/.fehbg | grep -Po "(?<=')[^']+(?=')"`))
				.split('\n')
				.map(l => l.trim())
				.filter(Boolean)
			: [config.wallpaper];

		if (!wallpapers || wallpapers.length === 0) return noop;

		if (wallpapers.length === 1) {
			return fs.createReadStream(wallpapers[0]);
		} else if (wallpapers[i]) {
			return fs.createReadStream(wallpapers[i]);
		} else {
			return noop;
		}
	}
	return noop;
}

async function status() {
	const id = 'displays';
	const displays = [];

	if (process.platform === 'darwin') {
		const displayData = (await cmd(`displayplacer list | grep -i 'Contextual screen id:\\|Origin: \\|<-- current mode'`))
			.split('Contextual screen id:')
			.filter(Boolean);

		for (const [i,display] of displayData.entries()) {
			const vals = display.split('\n').filter(Boolean);
			const primary = display.includes('main');
			const uid = vals[0].trim();
			const pos = vals[1]
				.match(/\((.*)\)/)[1]
				.split(',')
				.filter(Boolean)
				.map(Number);
			const res = vals[2]
				.match(/res:(.\S*)/)[1]
				.split('x')
				.filter(Boolean)
				.map(Number);

			displays.push({
				id: uid,
				primary,
				res: { x: res[0], y: res[1] },
				pos: { x: pos[0], y: pos[1] },
			});
		}

	} else if (process.platform === 'linux') {
		const displayData = (await cmd(`xrandr | grep ' connected' | awk '{ if($3 == "primary") print $1", "$4", "$3; else print $1", "$3}'`))
			.split('\n')
			.filter(Boolean);

		for (const [i,display] of displayData.entries()) {
			const [id, geo] = display.split(', ');
			const [w, h, x, y] = geo.split(/[x,+]/);
			const pos = { x: Number(x), y: Number(y) };
			const primary = display.includes('primary');
			const res = { x: Number(w.split('/')[0]), y: Number(y.split('/')[0]) };

			displays.push({ id, res, pos, primary });
		}
	}

	return { id, displays };
}

module.exports = { streamWallpaper, status };