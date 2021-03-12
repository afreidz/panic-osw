const loudness = require('loudness');
const cmd = require('../../lib/awaitcmd');

async function volume(opts) {
	await loudness.setVolume(opts.vol);
	return true;
}

async function brightness(opts) {
	const { brightness } = opts;
	if (process.platform === 'darwin') await cmd(`brightness ${brightness}`);
	if (process.platform === 'linux') {
		const displays = (await cmd(`xrandr | grep ' connected' | awk '{print $1}'`))
			.split('\n')
			.filter(Boolean);

		for (const display of displays) {
			await cmd(`xrandr --output ${display} --brightness ${brightness}`);
		}
	}
	return true
}

async function sleep() {
	if (process.platform === 'darwin') await cmd(`osascript -e 'tell application "System Events" to sleep'`);
  if (process.platform === 'linux') await cmd(`systemctl suspend`);
	return true;
}

async function shutdown() {
	if (process.platform === 'darwin') await cmd(`osascript -e 'tell app "loginwindow" to «event aevtrsdn»'`);
  if (process.platform === 'linux') await cmd(`systemctl poweroff`);
	return true;
}

async function restart() {
	if (process.platform === 'darwin') await cmd(`osascript -e 'tell app "loginwindow" to «event aevtrrst»'`);
  if (process.platform === 'linux') await cmd(`systemctl reboot`);
	return true;
}

async function logout() {
	if (process.platform === 'darwin') await cmd(`osascript -e 'tell app "System Events" to log out'`);
  if (process.platform === 'linux') await cmd(`kill -9 -1`);
	return true;
}

module.exports =  { volume, sleep, shutdown, restart, logout, brightness };