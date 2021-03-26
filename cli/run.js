const fs = require('fs');
const path = require('path');
const logger = require('../lib/logger');
const { spawn } = require('child_process');
const { handler: kill } = require('./kill');
const { files, dirs } = require('../consts');

exports.command = 'run';
exports.describe = 'runs the <command(s)>';
exports.builder = function (yargs) {
	yargs.option('command', { 
		alias: 'c',
		type: 'array',
		required: true,
		default: ['server', 'app'],
		choices: ['server', 'build', 'app'], 
	});
	return yargs;
}

exports.handler = async function (args) {
	const log = fs.openSync(files.log, 'a');

	if (args.command.includes('server')) {
		console.log('Starting nodejs server');
		if (args.command.includes('app')) await kill({ command: ['app'] });
		await kill({ command: ['server']});
		const server = spawn('sh', ['-c', `node ./server`], {
			cwd: dirs.root,
			detached: true, 
			stdio: ['ignore',log,log],
		});
		server.on('close', logger.error);
		server.unref();
		await new Promise(r => setTimeout(r,1000));
	}

	if (args.command.includes('build')) {
		console.log('Building application front-end');
		const build = spawn('sh', ['-c', `npx rollup -c ./app/rollup.config.js`], {
			cwd: dirs.root,
			detached: true,
			stdio: ['ignore',log,log],
		});
		build.on('error', logger.error);
		await new Promise(r => build.on('close', r));
	}

	if (args.command.includes('app')) {
		console.log('Starting application');
		const app = spawn('sh', ['-c', `node ./app`], {
			cwd: dirs.root,
			detached: true,
			stdio: ['ignore',log,log],
		});
		app.on('close', logger.error);
		app.unref();
		await new Promise(r => setTimeout(r,1000));
	}

	return 0;
}