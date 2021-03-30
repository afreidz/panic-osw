const url = require('url');
const status = require('./status');
const Client = require('./lib/client');
const logger = require('../lib/logger');
const { ips, views } = require('../consts');

module.exports = function (wss, http) {
	http.on('upgrade', (req, socket, head) => {
		wss.handleUpgrade(req, socket, head, ws => {
			wss.emit('connection', ws, req);
		});
	});

	wss.on('connection', async (ws, req) => {
		if (!ips.includes(req.socket.remoteAddress)) return ws.terminate();

		const pathname = url.parse(req.url).pathname.replace('/','');

		if (![...views, 'app','all',''].includes(pathname)) {
			logger.error(`context "${pathname}" is not supported. ws connection terminated`);
			return ws.terminate();
		}

		const scopes = pathname === 'all'
			? [...views, 'app']
			: pathname !== ''
				? [pathname]
				: [];

		const client = new Client(ws, scopes).start();
		ws.on('message', msg => handleMsg(msg, client));
	});
}

async function handleMsg(msg, client) {
	logger.log(`socket msg: ${msg}`);
	const data = JSON.parse(msg);

	if (data.target === 'dispatch') {
		if (data.action === 'idle') client.active = false;
		if (data.action === 'active') client.active = true;
	} else {
		const clients = Client.byScope(data.target);
		clients.forEach(c => c.rawsend(msg));
	}
}