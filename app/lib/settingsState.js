import { socket } from './socket';
import { writable } from 'svelte/store';

export const settings = writable({
	music: {},
	values: {},
	devices: {},
	networking: {},
});
socket.on('settings', e => settings.set(e.detail.settings));