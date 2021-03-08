const ws = require('ws');
const config = require('../config.proxy');

exports.command = 'msg <target> <action>';
exports.describe = 'send a message to the server to perform an <action> on a <target>';
exports.builder = function (yargs) {
	yargs.positional('target', { choices: ['login','bar','dash'] });
	yargs.positional('action', { choices: ['open','close','end'] });
	return yargs
}

exports.handler = async function (args) {
	const socket = new ws(`ws://127.0.0.1:${config.port}`);
	socket.on('error', error);
	
	socket.on('open', () => {
		const { target, action } = args;
		socket.send(JSON.stringify({ target, action }));
	});

	await new Promise(r => setTimeout(r, 200));
	return 0;
}

function error() {
	console.log(`Error connecting to socket at ws://127.0.0.1:${config.port}`);
	process.exit(1);	
}