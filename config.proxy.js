const { files } = require('./consts');

module.exports = new Proxy({}, {
	get(_, name) {
		delete require.cache[require.resolve(files.config)];
		return require(files.config)[name];
	}
});