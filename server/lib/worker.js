const status = require('../status');
const logger = require('../../lib/logger');
const { spawn } = require('child_process');
const { EventEmitter } = require('events');
const config = require('../../config.proxy');
const { parentPort, isMainThread, workerData, Worker } = require('worker_threads');

if (isMainThread) {
	const ee = new EventEmitter();
	const worker = new Worker(__filename);
	worker.on('message', msg => {
		const target = `${msg.target}`;
		delete msg.target;
		if (target === 'dash') ee.emit('dash', msg);
		if (target === 'bar') ee.emit('bar', msg);
		if (target === 'launch') ee.emit('launch', msg);
	});
	module.exports = ee;
} else {
	const intervals = {};
	const binding = spawn(`sh`, ['-c', `i3-msg -m -t subscribe '["binding"]'`]);
	const workspace = spawn(`sh`, ['-c', `i3-msg -m -t subscribe '["workspace"]'`]);

	binding.stdout.on('data', d => postUpdate('bar', 'layout', d));
	workspace.stdout.on('data', () => postUpdate('bar', 'workspaces'));

	intervals.short = setInterval(() => {
		postUpdate('dash', 'music');
		postUpdate('dash', 'devices');
	}, 2000);

	intervals.medium = setInterval(() => {
		postUpdate('dash', 'perf');
		postUpdate('launch', 'apps');
	}, 5000);

	intervals.long = setInterval(() => {
		postUpdate('dash', 'battery');
		postUpdate('dash', 'network');
		postUpdate('dash', 'bluetooth');
	}, 10000);

}

async function postUpdate (target, key, optData) {
	if (!status[key]) return;
	const data = await status[key](optData);
	parentPort.postMessage({ target, ...data });
}