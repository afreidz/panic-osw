const os = require('os');
const ora = require('ora');
const chalk = require('chalk');
const semver = require('semver');
const prompts = require('prompts');
const cmd = require('../lib/awaitcmd');
const { engines } = require('../package.json');
const { dirs, files, bin, deps } = require('../consts');

const now = new Date();
const yy = now.getFullYear() - 2000;
const mm = ("0" + (now.getMonth() + 1)).slice(-2);

exports.command = ['setup', 'config', 'cfg'];
exports.describe = '** run me first **';
exports.handler = async function (yargs) {

	const leader = 'Checking Dependencies...';
	const checker = ora(leader).start();
	const unmet = [];

	checker.text = `${leader}node`;
	if (!semver.satisfies(process.version, engines.node)) unmet.push(`node version ${engines.node}`);
	await new Promise(r => setTimeout(r, 300));

	for (dep of deps) {
		checker.text = `${leader}${dep}`;
		await cmd(`which ${dep}`).catch(_ => unmet.push(dep));
		await new Promise(r => setTimeout(r, 300));
	}
	checker.stop();

	if (unmet.length > 0) {
		console.log(chalk.red('\nPlease make sure all of the following dependencies are met before continuing:\n'));
		unmet.forEach(d => console.log(`\t• ${d}\n`));
		process.exit(1);
	}

	const fs = require('fs/promises');
	await fs.access(files.config).catch(async () => {
		await fs.mkdir(dirs.config).catch(_ => {});
		await fs.writeFile(files.config,'{}');
	});

	delete require.cache[require.resolve(files.config)];
	const existing = require(files.config);

	const questions = [{
		max: 65535,
		name: 'port',
		type: 'number',
		initial: existing.port || Number(`5${mm}${yy}`),
		message: 'What HTTP/Socket Port should be used for the server?',
	},{
		name: 'name',
		type: 'text',
		initial: existing.name || os.userInfo().username,
		message: 'What should you be called?',
	}];

	const users = (await cmd(`getent passwd {1000..6000} | awk -F':' '{print $1}'`))
		.split('\n')
		.filter(Boolean);

	questions.push({
		name: 'user',
		type: 'select',
		message: 'Which linux user are you?',
		choices: users.map(u => ({ title: u, value: u })),
	});

	questions.push({
		name: 'i3',
		initial: false,
		type: 'confirm',
		message: 'Do you run i3wm?',
	});

	questions.push({
		name: 'feh',
		initial: false,
		type: 'confirm',
		message: 'Do you run feh for setting desktop wallpaper?',
	});


	questions.push({
		initial: false,
		name: 'startup',
		type: 'confirm',
		message: 'Do you want to start now?'
	});

	const responses = await prompts(questions);
	const start = !!responses.startup;
	delete responses.startup;
	await fs.writeFile(files.config, JSON.stringify({ ...existing, ...responses }, null, 2));

	if(start) {
		await cmd(`${bin} run -c build -c server -c app`);
		console.log(`
	To change this (and a host of other settings) visit http://127.0.0.1:${responses.port}/settings
		`);
	} else {
		console.log(`
	Run \`${bin} --help\` to see what to do next
		`);
	}

	return 0;
}
