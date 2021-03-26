import { socket } from './socket';
import { writable, get } from 'svelte/store';

const params = new URLSearchParams(window.location.search);
export const workspaces = writable([]);
export const mode = writable('󰢥');

socket.on('workspaces', e => {
	if (e.detail.workspaces) {
		const data = params.has('output')
			? e.detail.workspaces.filter(w => (w.output === params.get('output')))
			: e.detail.workspaces;
		workspaces.set(data);
	}
});

socket.on('layout', e => {
	if (e.detail.layout) {
		const layout = e.detail.layout;
    if (layout === 'splith') mode.set('󰢥');
    if (layout === 'splitv') mode.set('󰢢');
    if (layout === 'resize') mode.set('󰁌');
    if (layout === 'launch') mode.set('󰍉');
	}
});