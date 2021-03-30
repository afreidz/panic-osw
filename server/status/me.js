const fs = require('fs');
const os = require('os');
const fsp = require('fs/promises');
const { Readable } = require('stream');
const { spawn } = require('child_process');
const config = require('../../config.proxy');
const logger = require('../../lib/logger');

async function streamAvatar() {
	const noop = Readable.from([]);
	const path = `/home/${config.user || os.userInfo().username}/.face`;
	
	try {
		await fsp.access(path)
	} catch (_) {
		return noop;
	}

	return fs.createReadStream(path);
}

async function status() {
	const id = 'me';
	const whoami = config.user || os.userInfo().username;
	return { id, whoami, name: config.name };
}

module.exports = { status, streamAvatar };