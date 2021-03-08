const fs = require('fs');
const logger = require('../lib/logger');
const { spawn } = require('child_process');
const { files, dirs } = require('../consts');

exports.command = 'run';
exports.describe = 'runs the <command(s)>';
exports.builder = function (yargs) {
	yargs.option('command', { 
		alias: 'c',
		type: 'array',
		required: true,
		choices: ['server', 'build', 'app'], 
	});
	return yargs;
}

exports.handler = async function (args) {
	const log = fs.openSync(files.log, 'a');
	
	if (args.command.includes('build')) {
		const build = spawn('sh', ['-c', `npx rollup -c ./app/rollup.config.js`], {
			cwd: dirs.root,
			detached: true,
			stdio: ['ignore',log,log],
		});
		build.on('error', logger.error);
		await new Promise(r => build.on('close', r));
	}
	
	if (args.command.includes('server')) {
		const server = spawn('sh', ['-c', `node ./server`], { 
			cwd: dirs.root,
			detached: true, 
			stdio: ['ignore',log,log],
		});
		server.on('close', logger.error);
		server.unref();
	}

	if (args.command.includes('app')) {
		await new Promise(r => setTimeout(r,1000));
		const app = spawn('sh', ['-c', 'npx electron .'], {
			cwd: dirs.root,
			detached: true,
			stdio: ['ignore',log,log],
		});
		app.on('close', logger.error);
		app.unref();
	}

	return 0;
}