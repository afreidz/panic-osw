const { wms } = require('../../consts');
const { interfaces } = require('../status/network');
const { Validator } = require('node-input-validator');
const types = {};
let ifs = null;

types['system.volume'] = {
	vol: ['required', 'integer', 'between:0,100'],
};

types['system.brightness'] = {
	brightness: ['required', 'numeric', `between:0.3,1.1`],
};

types['devices.toggle'] = {
	device: 'required',
};

types['settings.update'] = {
	'settings.bar': 'boolean',
	'settings.dash': 'boolean',
	'settings.wm': `in:${wms.join(',')}`,
	'settings.wallpaper.provider': 'in:i3',
	'settings.port': 'integer|between:0,65535',

	'settings.devices.url': 'url',
	'settings.devices.key': 'string|maxLength:40',
	'settings.devices.configured.*.spot': 'integer',
	'settings.devices.secret': 'string|maxLength:40',

	'settings.music.api': 'url',
	'settings.music.auth': 'url',
	'settings.music.key': 'string|maxLength:40',
	'settings.music.secret': 'string|maxLength:40',
	'settings.music.refresh': 'string|maxLength:40',
};

module.exports = async function(data, type) {
	if (!ifs) ifs = await interfaces();
	types['settings.update']['settings.networking.eth'] = `in:${ifs.join(',')}`;
	types['settings.update']['settings.networking.wifi'] = `in:${ifs.join(',')}`;

	return new Validator(data, types[type] || {});
}
