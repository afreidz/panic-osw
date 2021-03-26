import { writable } from 'svelte/store';

const params = new URLSearchParams(window.location.search);
export const whoami = writable(params.get('user'));