const os = require('os');
const path = require('path');

const home = os.homedir();
const root = path.resolve(__dirname);
const config = path.join(home, '.config', 'panic');

const consts = {
	dirs: { home, config, root },
	files: {
		log: path.join(config, 'main.log'),
		config: path.join(config, 'config.json'),
	},
	platforms: ['linux', 'darwin'],
	wms: ['i3'],
	ips: ['::1', '127.0.0.1', '::ffff:127.0.0.1'],
	views: ['dash','settings','locker','bar','launch'],
};

module.exports = consts;