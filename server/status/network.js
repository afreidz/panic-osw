const os = require('os');
const wifi = require('node-wifi');
const config = require('../../config.proxy'); 

module.exports = async function status() {
	const id = 'network';
	wifi.init({ iface: config.networking.wifi });

	const eth = (os.networkInterfaces()[config.networking.eth] || [])
		.find(i => i.family === 'IPv4');
	
	const connection = (await wifi.getCurrentConnections())[0];
	const wf = (os.networkInterfaces()[config.networking.wifi] || [])
		.find(i => i.family === 'IPv4');

	return {
		id,
		wifi: { ip: wf?.address ?? null, ssid: connection?.ssid ?? null, connected: !!connection?.ssid },
		eth: { ip: eth?.address ?? null, connected: !!eth, },
	}
}