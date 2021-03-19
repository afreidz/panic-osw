const logger = require('../lib/logger');
const LaunchClient = require('../lib/i3run.js');

exports.command = 'launch';
exports.describe = 'raise or run the <application>';
exports.builder = function (yargs) {
	yargs.option('type', { 
		alias: 't',
		type: 'array',
		required: true,
		choices: ['class', 'title'], 
	});
	yargs.option('search', { 
		alias: 's',
		type: 'string',
		required: true,
	});
	yargs.option('command', { 
		alias: 'c',
		type: 'string',
		required: true,
	});
	return yargs;
}

exports.handler = async function (args) {
	const i3c = new LaunchClient('/usr/bin/i3-msg');
	const opts = { cmd: args.command };
	opts[args.type] = args.search;
	logger.log(`Launching ${JSON.stringify(opts)}`);
	await i3c.run(opts);
	return 0;
}