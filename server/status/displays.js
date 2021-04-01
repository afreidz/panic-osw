const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const cmd = require('../../lib/awaitcmd');
const logger = require('../../lib/logger');
const config = require('../../config.proxy');

async function streamWallpaper (i) {
	const noop = Readable.from([]);
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
	return noop;
}

async function status() {
	const id = 'displays';
	const displays = [];

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

	return { id, displays };
}

module.exports = { streamWallpaper, status };
