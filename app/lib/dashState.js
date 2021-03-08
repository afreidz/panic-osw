import { socket } from './socket';
import { network } from './actions';
import { writable, get } from 'svelte/store';

export const todos = writable(JSON.parse(localStorage.getItem('todos') || '[]'));
todos.subscribe(v => localStorage.setItem('todos', JSON.stringify(v)));

export const speedtest = writable(JSON.parse(localStorage.getItem('speedtest') || 'null'));
speedtest.subscribe(v => localStorage.setItem('speedtest', JSON.stringify(v)));
if (!get(speedtest)) network.speedtest().then(s => speedtest.set(s));

export const wifi = writable(null);
export const ethernet = writable({ connected: false, ip: null });
socket.on('network', e => wifi.set(e.detail.wifi));
socket.on('network', e => ethernet.set(e.detail.eth));

export const song = writable(null);
socket.on('music', e => song.set(e.detail));

export const bluetooth = writable(null);
socket.on('bluetooth', e => bluetooth.set(e.detail));

export const me = writable(null);
socket.on('me', e => me.set(e.detail));

export const volume = writable(null);
socket.on('volume', e => volume.set(e.detail.vol));

export const brightness = writable(null);
export const brightnessEnabled = writable(false);
socket.on('brightness', e => brightness.set(e.detail.brightness));
socket.on('brightness', e => brightnessEnabled.set(e.detail.enabled));

export const displays = writable(null);
socket.on('displays', e => displays.set(e.detail.displays));

export const devices = writable(null);
socket.on('device', e => devices.set(e.detail.devices));

export const cpuUsage = writable(JSON.parse(localStorage.getItem('cpuUsage') || '[]'));
cpuUsage.subscribe(v => localStorage.setItem('cpuUsage', JSON.stringify(v)));

export const memUsage = writable(JSON.parse(localStorage.getItem('memUsage') || '[]'));
memUsage.subscribe(v => localStorage.setItem('memUsage', JSON.stringify(v)));

socket.on('perf', e => {
  const { cpu, mem } = e.detail;
  const cpuState = get(cpuUsage);
  const memState = get(memUsage);

  const cpuIncoming = cpuState.length < 20
    ? [...cpuState, cpu]
    : [...cpuState.slice(1), cpu];

  const memIncoming = memState.length < 20
    ? [...memState, mem]
    : [...memState.slice(1), mem];

  cpuUsage.set(cpuIncoming);
  memUsage.set(memIncoming);
});