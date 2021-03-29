const fs = require('fs');
const os = require('os');
const { Readable } = require('stream');
const { spawn } = require('child_process');
const config = require('../../config.proxy');

function streamAvatar() {
	return fs.createReadStream(`/home/${config.user || os.userInfo().username}/.face`);
}

async function status() {
	const id = 'me';
	const whoami = config.user || os.userInfo().username;
	return { id, whoami, name: config.name };
}

module.exports = { status, streamAvatar };