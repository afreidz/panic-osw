const osutils = require('os-utils');
const cmd = require('../../lib/awaitcmd');
const logger = require('../../lib/logger');

module.exports = async function perf() {
	const id = 'perf';
	const cpu = await new Promise(osutils.cpuUsage);
	const mem = parseFloat(await cmd(`free | grep Mem: | awk '{print $3/$2}'`));

	return { id, cpu, mem };
}
