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
		const totalmem_kb = parseFloat(await cmd(`cat /proc/meminfo | grep MemTotal | awk '{print $2}'`));
		const usedmem_kb = parseFloat(await cmd(`ps -eo size,command --sort -size | awk '{ hr=$1/1024 ; sum +=hr } END {print sum}'`))*1024;
		mem = usedmem_kb/totalmem_kb;
	}
	
	return { id, cpu, mem };
}