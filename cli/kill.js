const send = require('./socket');
const { files } = require('../consts');
const cmd = require('../lib/awaitcmd');
const logger = require('../lib/logger');
const config = require('../config.proxy');

exports.command = 'kill';
exports.describe = 'kills the <command(s)>';
exports.builder = function (yargs) {
	yargs.option('command', { 
		alias: 'c',
		type: 'array',
		required: true,
		default: ['server','app'],
		choices: ['server','app'], 
	});
	return yargs;
}

exports.handler = async function (args) {
	
	if (args.command.includes('app')) {
		console.log(`Killing GUI Application`);
		logger.log(`Killing GUI Application`);
		await send('app', 'kill');
	}

	if (args.command.includes('server')) {
		const pid = (await cmd(`lsof -i :${config.port} | grep LISTEN | awk '{print $2}'`)).trim();
	
		if(!!pid) {
			console.log(`Killing PID ${pid} listening on port ${config.port}`);
			logger.log(`Killing PID ${pid} listening on port ${config.port}`);
			await cmd(`kill -9 ${pid}`);
		}
	}
	//await new Promise(r => setTimeout(r, 2000));
	return 0;
}