const fs = require('fs');
const os = require('os');
const { Readable } = require('stream');
const { spawn } = require('child_process');
const config = require('../../config.proxy');

function streamAvatar() {
	if(process.platform === 'darwin') {
		return spawn('sh', ['-c', 'dscl . -read ~ JPEGPhoto | xxd -r -p']).stdout;
	} else if (process.platform === 'linux') {
		return fs.createReadStream(`/home/${config.user || os.userInfo().username}/.face`);
	}
	return Readable.from([null]);
}

async function status() {
	const id = 'me';
	const whoami = config.user || os.userInfo().username;
	return { id, whoami, name: config.name };
}

module.exports = { status, streamAvatar };