const os = require('os');
const fs = require('fs/promises');
const prompts = require('prompts');
const cmd = require('../lib/awaitcmd');
const { dirs, files, bin } = require('../consts');

const now = new Date();
const yy = now.getFullYear() - 2000;
const mm = ("0" + (now.getMonth() + 1)).slice(-2);

exports.command = ['setup', 'config', 'cfg'];
exports.describe = '** run me first **';
exports.handler = async function (yargs) {

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

	if (process.platform === 'linux') {
		const users = (await cmd(`getent passwd {1000..6000} | awk -F':' '{print $1}'`))
			.split('\n')
			.filter(Boolean);

		questions.push({
			name: 'user',
			type: 'select',
			message: 'Which linux user are you?',
			choices: users.map(u => ({ title: u, value: u })),
		});
	}

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