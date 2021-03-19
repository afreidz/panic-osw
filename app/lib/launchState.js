import { socket } from './socket';
import { writable } from 'svelte/store';

export const apps = writable([]);
socket.on('apps', e => apps.set(e.detail.apps));