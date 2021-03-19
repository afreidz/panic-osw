const ws = require('ws');
const config = require('../config.proxy');

async function send (target, action) {
	const socket = new ws(`ws://127.0.0.1:${config.port}`, 'ipc');
	socket.on('error', () => {});
	
	socket.on('open', () => {
		socket.send(JSON.stringify({ target, action }));
	});

	await new Promise(r => setTimeout(r, 200));
	return 0;
}

module.exports = send;