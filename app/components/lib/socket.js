class SocketClient extends EventTarget {
	constructor(url, prot = 'client') {
		super();
		this.socket = new WebSocket(url, prot);
		this.ready = new Promise(r => this.socket.addEventListener('open',r));
		
		this.socket.addEventListener('message', e => {
			const detail = JSON.parse(e.data);
			const type = `${detail.id}`;
			delete detail.id;
			this.dispatchEvent( new CustomEvent(type, { detail }));
		});
	}

	async send(msg) {
		await this.ready;
		this.socket.send(JSON.stringify({ ...msg, target: 'dispatch' }));
	}

	on(type, cb = () => {}) {
		this.addEventListener(type, cb);
	}

	off(type, cb) {
		this.removeEventListener(type, cb);
	}
}

export const socket = window.location.pathname.includes('dash')
	? new SocketClient(`ws://${location.host}/dash`)
	: window.location.pathname.includes('bar')
		? new SocketClient(`ws://${location.host}/bar`)
		: window.location.pathname.includes('login')
			? new SocketClient(`ws://${location.host}/login`)
			: window.location.pathname.includes('launch')
			? new SocketClient(`ws://${location.host}/launch`)
			: null;