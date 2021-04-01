const { OPEN } = require('ws');
const status = require('../status');
const { spawn } = require('child_process');
const logger = require('../../lib/logger');
const config = require('../../config.proxy');
const clients = new Set();

const binding = spawn(`sh`, ['-c', `i3-msg -m -t subscribe '["binding"]'`]);
const workspace = spawn(`sh`, ['-c', `i3-msg -m -t subscribe '["workspace"]'`]);

class ListedSet extends Set {
	constructor(args) {
		super(args);
	}
	get list() { return [...this] }
}

class Client {
	#ws = null;
	#intervals = [];

	constructor(ws, scopes = []) {
		this.#ws = ws;
		this.active = true;
		this.scopes = new ListedSet();

		scopes.forEach(s => this.scopes.add(s));

		ws.on('close', () => {
			clients.delete(this);
			logger.log(`socket disconnected | scopes: [${this.scopes.list.join(',')}]`);
		});

		clients.add(this);
		if (this.ready && !this.ipc) this.update();
		logger.log(`socket connected | scopes: [${this.scopes.list.join(',')}]`);
	}

	get ipc() {
		return this.#ws.protocol === 'ipc';
	}

	get ready() {
		return this.#ws.readyState === OPEN;
	}

	send(data) {
		this.#ws.send(JSON.stringify(data));
		return this;
	}

	rawsend(data) {
		this.#ws.send(data);
		return this;
	}

	async update() {
		if (this.ipc) return this;
		if (!this.active) return this;

		if (this.scopes.has('dash')) {
			status.me().then(d => this.send(d));
			status.volume().then(d => this.send(d));
			status.battery().then(d => this.send(d));
			status.bluetooth().then(d => this.send(d));
			status.brightness().then(d => this.send(d));
			if (config.music) status.music().then(d => this.send(d));
			if (config.networking) status.network().then(d => this.send(d));
			if (config.feh || config.wallpaper) status.displays().then(d => this.send(d));
			if (config.secretstuff && config.devices) status.devices().then(d => this.send(d));
		}

		if (this.scopes.has('launch')) {
			status.apps().then(d => this.send(d));
		}

		if (this.scopes.has('bar')) {
			status.workspaces().then(d => this.send(d));
		}
		return this;
	}

	start() {
		if (this.ipc) return this;
		if (this.#intervals.length) this.#intervals.forEach(clearInterval);

		if (this.scopes.has('dash')) {
			this.#intervals.push(setInterval(() => status.perf().then(d => this.send(d)), 5000));

			this.#intervals.push(setInterval(() => {
				if (config.music) status.music().then(d => this.send(d));
				if (config.secretstuff) status.devices().then(d => this.send(d));
			}, 1000));

			this.#intervals.push(setInterval(() => {
				status.battery().then(d => this.send(d));
				status.bluetooth().then(d => this.send(d));
				if (config.networking) status.network().then(d => this.send(d));
			}, 5000));
		}

		if (this.scopes.has('bar')) {
			binding.stdout.on('data', d => status.layout(d).then(d => this.send(d)));
			workspace.stdout.on('data', () => status.workspaces().then(d => this.send(d)));
		}

		if (this.scopes.has('launch')) {
			this.#intervals.push(setInterval(() => status.apps().then(d => this.send(d)), 5000));
		}
		return this;
	}

	static byScope(s) {
		return [...clients].filter(c => {
			return c.scopes.list.includes(s) && c.ready;
		});
	}
}

module.exports = Client;
