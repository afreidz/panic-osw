const osutils = require('os-utils');
const cmd = require('../../lib/awaitcmd');
const logger = require('../../lib/logger');

module.exports = async function perf() {
	const id = 'perf';
	const cpu = await new Promise(osutils.cpuUsage);
	const totalmem_kb = parseFloat(await cmd(`cat /proc/meminfo | grep MemTotal | awk '{print $2}'`));
	const usedmem_kb = parseFloat(await cmd(`ps -eo size,command --sort -size | awk '{ hr=$1/1024 ; sum +=hr } END {print sum}'`))*1024;
	const mem = usedmem_kb/totalmem_kb;

	logger.log('MEM', mem);
	
	return { id, cpu, mem };
}