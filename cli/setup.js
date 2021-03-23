const os = require('os');
const fs = require('fs/promises');
const prompts = require('prompts');
const cmd = require('../lib/awaitcmd');
const { dirs, files } = require('../consts');

const now = new Date();
const yy = now.getFullYear() - 2000;
const mm = ("0" + (now.getMonth() + 1)).slice(-2);

exports.command = ['setup', 'config', 'cfg'];
exports.describe = '** run me first **';
exports.handler = async function () {
	const questions = [{
		max: 65535,
		name: 'port',
		type: 'number',
		initial: Number(`5${mm}${yy}`),
		message: 'What HTTP/Socket Port should be used for the server?',
	},{
		name: 'name',
		type: 'text',
		initial: os.userInfo().username,
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
		questions.push({
			name: 'i3',
			type: 'confirm',
			message: 'Do you run i3wm?',
		});
	}

	const responses = await prompts(questions);
	delete responses.i3;
	
	await fs.access(files.config).catch(async () => {
		await fs.mkdir(dirs.config).catch(_ => {});
		await fs.writeFile(files.config,'{}');
	});

	let existing = require(files.config);
	await fs.writeFile(files.config, JSON.stringify({ ...existing, ...responses }, null, 2));
	return 0;
}