const logger = require('./logger');
const { spawn } = require('child_process');

module.exports = async function(c) {
	const proc = spawn('sh', ['-c', c]);
	let stdout = '';
	let stderr = '';

	for await ( const chunk of proc.stdout ) stdout += chunk;
	for await ( const chunk of proc.stderr ) stderr += chunk;

	const exit = await new Promise(r => proc.on('close', r));

	if (exit !== 0) logger.error(`CMD: \`${c}\` failed with exit code ${exit} and error: ${stderr}`);

	return stdout;
}