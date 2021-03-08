const osutils = require('os-utils');
const cmd = require('../../lib/awaitcmd');

module.exports = async function perf() {
	const id = 'perf';
	
	const cpu = await new Promise(osutils.cpuUsage);
	let mem;
	
	if (process.platform === 'darwin') {
		const purgable = parseFloat(await cmd(`vm_stat -c 1 2 | awk '{ if ($1 == ($1+0)) print $7}'`))*4096;
		const internal = parseFloat(await cmd(`sysctl vm.page_pageable_internal_count | awk '{print $2}'`))*4096;
		const total = parseFloat(await cmd(`vm_stat -c 1 1 | awk '{ if($1 == ($1+0)) print ($1+$2+$3+$6+$13+$15)}'`))*4096;
		const used = internal-purgable;
		mem = used/total;
	} else if (process.platform === 'linux') {
		const freemem = osutils.freemem();
		const totalmem = osutils.totalmem();
		const usedmem = totalmem-freemem;
		mem = usedmem/totalmem;
	}
	
	return { id, cpu, mem };
}