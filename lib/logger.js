const path = require('path');
const { files } = require('../consts');
const logger = require('electron-log');

logger.transports.console.level = false;
logger.transports.file.resolvePath = vars => {
	return files.log;
}

function middleware(req, res, next) {
	const { method, url } = req;
	const { statusCode } = res;
	logger.log(`${method} ${url} ${statusCode}`);
	next();
}

module.exports = { ...logger, middleware };
