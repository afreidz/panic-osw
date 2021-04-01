const ws = require('ws');
const send = require('./socket');
const config = require('../config.proxy');

exports.command = 'close';
exports.describe = 'close the <window(s)>';
exports.builder = function (yargs) {
	yargs.option('window', {
		alias: 'w',
		type: 'array',
		required: true,
		choices: ['locker', 'dash', 'bar', 'launch'],
	});
	return yargs;
}

exports.handler = async function (args) {
	const { window } = args;
	await Promise.all(window.map(w => send(w, 'close')));
	return 0;
}
