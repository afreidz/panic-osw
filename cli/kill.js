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
		choices: ['server'], 
	});
	return yargs;
}

exports.handler = async function (args) {
	if (args.command.includes('server')) {
		const pid = (await cmd(`lsof -i :${config.port} | grep LISTEN | awk '{print $2}'`)).trim();
	
		if(!!pid) {
			logger.log(`Killing PID ${pid} listening on port ${config.port}`);
			await cmd(`kill -9 ${pid}`);
		}
	}
	return 0;
}