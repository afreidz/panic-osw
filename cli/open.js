const ws = require('ws');
const send = require('./socket');
const config = require('../config.proxy');

exports.command = 'open';
exports.describe = 'opens the <window(s)>';
exports.builder = function (yargs) {
	yargs.option('window', { 
		alias: 'w',
		type: 'array',
		required: true,
		choices: ['locker', 'dash', 'bar'], 
	});
	return yargs;
}

exports.handler = async function (args) {
	const { window } = args;
	await Promise.all(window.map(w => send(w, 'open')));
	return 0;
}