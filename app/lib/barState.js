import { socket } from './socket';
import { writable, get } from 'svelte/store';

const params = new URLSearchParams(window.location.search);
export const workspaces = writable([]);
export const mode = writable('󰢥');

socket.on('bar', e => {
  if (params.get('output') && e.detail.workspaces) {
    const index = params.get('output');
    const outputWorkspaces = e.detail.workspaces[indez];
    workspaces.set(outputWorkspaces);
  } else if (e.detail.workspaces) {
    workspaces.set(e.detail.workspaces);
  } else if (e.detail.layout) {
    const layout = e.detail.layout;
    if (layout === 'splith') mode.set('󰢥');
    if (layout === 'splitv') mode.set('󰢢');
    if (layout === 'resize') mode.set('󰁌');
    if (layout === 'launch') mode.set('󰍉');
  }
});