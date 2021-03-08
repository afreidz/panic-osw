const ws = require('ws');
const path = require('path');
const http = require('http');
const routes = require('./routes');
const express = require('express');
const cmd = require('../lib/awaitcmd');
const logger = require('../lib/logger');
const checkAccess = require('./access');
const bodyParser = require('body-parser');
const config = require('../config.proxy');
const { platforms } = require('../consts');
const socketSetup = require('./socketsetup');

if (!platforms.includes(process.platform)) {
	const msg = `Platform ${process.platform} not supported`;
	logger.error(msg);
	process.exit(1);
}

const app = express();
const httpServer = http.createServer(app);
const socketServer = new ws.Server({ noServer: true });
socketSetup(socketServer, httpServer);

app.use(logger.middleware);
app.use(checkAccess);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../', 'app', 'public')));

app.get('/alive', (req, res) => {
	res.send('alive');
});

app.use(routes);

app.use((err, req, res, next) => {
	logger.error(err);
	res.sendStatus(404);
});

(async () => {
	const pid = (await cmd(`lsof -i :${config.port} | grep LISTEN | awk '{print $2}'`)).trim();
	
	if(!!pid) {
		logger.log(`Killing PID ${pid} listening on port ${config.port}`);
		await cmd(`kill -9 ${pid}`);
	}

	await new Promise(r => setTimeout(r), 500);
	httpServer.listen(config.port, () => logger.log(`Server started on port ${config.port}`));
})();