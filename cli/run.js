const fs = require('fs');
const path = require('path');
const logger = require('../lib/logger');
const { spawn } = require('child_process');
const { handler: kill } = require('./kill');
const { files, dirs, display, vt } = require('../consts');

exports.command = 'run';
exports.describe = 'runs the <command(s)>';
exports.builder = function (yargs) {
	yargs.option('command', { 
		alias: 'c',
		type: 'array',
		required: true,
		choices: ['server', 'build', 'app', 'xserver'], 
	});
	return yargs;
}

exports.handler = async function (args) {
	const log = fs.openSync(files.log, 'a');
	if (args.command.includes('xserver')) {
		process.stdout.write('Starting X11 server...');
		const xserver = spawn('sh', ['-c', `Xorg ${display} ${vt}`], { 
			cwd: dirs.root,
			detached: true,
			stdio: ['ignore',log,log],
		});
		fs.writeFileSync(files.xpidfile, `${xserver.pid}`);
		const feh = spawn('sh', ['-c', `DISPLAY=${display}`, path.join(dirs.home,'.fehbg')]);
		xserver.on('close', logger.error);
		xserver.unref();
		await new Promise(r => setTimeout(r,1000));
		process.stdout.write('Done\n');
	}

	if (args.command.includes('server')) {
		process.stdout.write('Starting nodejs server...');
		await kill({ command: ['server']});
		const server = spawn('sh', ['-c', `node ./server`], { 
			cwd: dirs.root,
			detached: true, 
			stdio: ['ignore',log,log],
		});
		server.on('close', logger.error);
		server.unref();
		await new Promise(r => setTimeout(r,1000));
		process.stdout.write('Done\n');
	}


	if (args.command.includes('build')) {
		process.stdout.write('Building application front-end...');
		const build = spawn('sh', ['-c', `npx rollup -c ./app/rollup.config.js`], {
			cwd: dirs.root,
			detached: true,
			stdio: ['ignore',log,log],
		});
		build.on('error', logger.error);
		await new Promise(r => build.on('close', r));
		process.stdout.write('Done\n');
	}

	if (args.command.includes('app')) {
		process.stdout.write('Starting application...');
		const app = spawn('sh', ['-c', `DISPLAY=${display} npx electron .`], {
			cwd: dirs.root,
			detached: true,
			stdio: ['ignore',log,log],
		});
		app.on('close', logger.error);
		app.unref();
		await new Promise(r => setTimeout(r,1000));
		process.stdout.write('Done\n');
	}

	return 0;
}