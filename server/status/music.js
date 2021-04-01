const fetch = require('node-fetch');
const tokens = require('../lib/tokens');
const config = require('../../config.proxy');

module.exports = async function status() {
	const id = 'music';
	const token = await tokens.music();
	const resp = await fetch(`${config.music.api}/me/player/currently-playing?market=US`, {
		headers: { 'Authorization': `Bearer ${token}` },
	});

	const song = resp.status !== 200 ? {} : await resp.json();

	return {
		id,
		title: song?.item?.name ?? '',
		elapsed: song?.progress_ms ?? '',
		playing: song?.is_playing ?? false,
		album: song?.item?.album.name ?? '',
		length: song?.item?.duration_ms ?? '',
		image: song?.item?.album?.images[1].url ?? '',
		artist: song?.item?.artists.map(a => a.name).join(',') ?? '',
	};
}
