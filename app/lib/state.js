import { writable } from 'svelte/store';

export const visible = writable(!document.hidden);
