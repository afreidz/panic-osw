const { files } = require('./consts');

module.exports = new Proxy({}, {
	get(_, name) {
		return require(files.config)[name]
	}
});