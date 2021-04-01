const { ips } = require('../consts');
const logger = require('../lib/logger');
const config = require('../config.proxy');

module.exports = async function (req, res, next) {
	const { remoteAddress } = req.connection;
	if(!ips.includes(remoteAddress)) {
		logger.error(`Access attempt failed for remote address ${remoteAddress}`);
		return res.sendStatus(403);
	}
	return next();
}
