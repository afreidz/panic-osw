const url = require('url');
const { OPEN } = require('ws');
const status = require('./status');
const worker = require('./lib/worker');
const logger = require('../lib/logger');
const { ips, views } = require('../consts');
const clients = new Set();

worker.on('dash', data => {
	const dashclients = [...clients].filter(c => (c.scopes.includes('dash') && c.ws.protocol !== 'ipc'));
	if (dashclients.length === 0) return;
	if (data.id === 'perf') return dashclients.forEach(c => c.send(data));

	dashclients.forEach(c => {
		if (c.active) c.send(data);
	});
});

worker.on('bar', data => {
	const barclients = [...clients].filter(c => (c.scopes.includes('bar') && c.ws.protocol !== 'ipc'));
	if (barclients.length === 0) return;
	barclients.forEach(c => c.send(data));
});

worker.on('launch', data => {
	const launchclients = [...clients].filter(c => (c.scopes.includes('launch') && c.ws.protocol !== 'ipc'));
	if (launchclients.length === 0) return;
	launchclients.forEach(c => c.send(data));
});

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

		const client = { 
			ws,
			scopes: [],
			active: true,
			send(data) {
				ws.send(JSON.stringify(data));
			} 
		};
		
		if (pathname === 'all') {
			client.scopes = [...views, 'app'];
		} else if (pathname !== '') {
			client.scopes = [pathname];
		}

		clients.add(client);

		if (client.scopes.includes('dash')) {
			client.send(await status.me());
			client.send(await status.music());
			client.send(await status.volume());
			client.send(await status.battery());
			client.send(await status.devices());
			client.send(await status.network());
			client.send(await status.displays());
			client.send(await status.bluetooth());
			client.send(await status.brightness());
		}
		
		if (client.scopes.includes('launch')) {
			client.send(await status.apps());
		}

		if (client.scopes.includes('bar')) {
			client.send(await status.workspaces());
		}
		
		ws.on('close', () => {
			logger.log(`socket disconnected | scopes: [${client.scopes.join(',')}]`);
		});

		ws.on('message', msg => handleMsg(msg, client));
		
		logger.log(`socket connected | scopes: [${client.scopes.join(',')}]`);
	});
}

async function handleMsg(msg, client) {
	logger.log(`socket msg: ${msg}`);
	const data = JSON.parse(msg);

	if (data.target === 'dispatch') {
		if (data.action === 'idle') client.active = false;
		if (data.action === 'active') client.active = true;
	} else {
		clients.forEach(c => {
			if (c.scopes.includes(data.target) && c.active && c.ws.readyState === OPEN) {
				c.ws.send(msg);
			}
		});
	}
}