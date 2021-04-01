const ws = require('ws');
const { EventEmitter } = require('events');

class SocketClient extends EventEmitter {
	constructor(url, prot = 'client') {
		super();
		this.socket = new ws(url, prot);
		this.ready = new Promise(r => this.socket.on('open',r));

		this.socket.on('message', e => {
			const detail = JSON.parse(e);
			const { action, target } = detail;
			this.emit(action, target);
		});
	}

	async on(type, cb = () => {}) {
		this.addListener(type, cb);
	}

	async off(type, cb) {
		this.removeListener(type, cb);
	}
}

module.exports = SocketClient;
