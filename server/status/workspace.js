const cmd = require('../../lib/awaitcmd');
const config = require('../../config.proxy');

module.exports = async function () {
	if (config.wm !== 'i3') return;
	const status = await cmd(`i3-msg -t get_workspaces`);
	const workspaces = JSON.parse(status).map(ws => ({
		id: ws.id,
		num: ws.num,
		name: ws.name,
		output: ws.output,
		urgent: ws.urgent,
		visible: ws.visible,
		focused: ws.focused,
	}));
	return { workspaces };
}

