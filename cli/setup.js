const os = require('os');
const fs = require('fs/promises');
const prompts = require('prompts');
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
		message: 'HTTP/Socket Port for the server?',
	},{
		name: 'name',
		type: 'text',
		initial: os.userInfo().username,
		message: 'What should you be called?',
	}];

	if (process.platform === 'linux') {
		questions.push({
			name: 'i3',
			type: 'confirm',
			message: 'Do you run i3wm?',
		});
		questions.push({
			name: 'bar',
			active: 'yes',
			inactive: 'no',
			type: p => p && 'toggle',
			message: 'Do you want to enable the top bar?',
		});
		questions.push({
			name: 'login',
			active: 'yes',
			inactive: 'no',
			type: 'toggle',
			message: 'Do you want to enable the login manager?',
		});
		questions.push({
			name: 'wm',
			type: (_,v) => (!v.i3 && v.login) && 'text',
			message: 'What command should run after login?',
		});
	}

	questions.push({
		name: 'dash',
		active: 'yes',
		inactive: 'no',
		type: 'toggle',
		message: 'Do you want to enable the dashboard widget?',
	});

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