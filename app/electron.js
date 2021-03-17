const ws = require('ws');
const logger = require('../lib/logger');
const config = require('../config.proxy');
const { dirs, platforms } = require('../consts');
const { app, BrowserWindow, screen, globalShortcut, shell } = require('electron');

if (!platforms.includes(process.platform)) {
	throw new Error(`Platform ${process.platform} not supported`);
	process.exit(1);
}

if (!config.bar && !config.dash &!config.login) {
	console.log('nothing to do.');
	process.exit(0);
}

logger.catchErrors({ showDialog: false });

if (process.platform === 'darwin') {
	app.setPath('userData', dirs.config);
	app.dock.hide();
	app.on('will-quit', globalShortcut.unregisterAll);
	app.commandLine.appendSwitch('enable-transparent-visuals');
} else if (process.platform === 'linux') {
	app.setPath('userData', dirs.config);
	app.commandLine.appendSwitch('disable-gpu');
	app.commandLine.appendSwitch('enable-transparent-visuals');
}

const socket = new ws(`ws://127.0.0.1:${config.port}/all`, 'ipc');
const commonopts = {
	frame: false,
	moveable: false,
	resizeable: false,
	transparent: true,
	maximizeable: false,
	minimizeable: false,
	simpleFullscreen: true,
	webPreferences: { contextIsolation: true, backgroundThrottling: false },
};
const windows = new Map();
windows.set('bar', null);
windows.set('dash', null);
windows.set('login', null);

socket.on('message', msg => {
	const data = JSON.parse(msg);
	if (data.action === 'open' && config[data.target]) return open(data.target);
	if (data.action === 'close') return close(data.target);
});

function open(target) {
	const screens = screen.getAllDisplays();
	const pos = screen.getCursorScreenPoint();
	const primary = screen.getPrimaryDisplay();
	const display = screen.getDisplayNearestPoint(pos);
	const url = new URL(`http://127.0.0.1:${config.port}`);
	url.pathname = target;

	if (target === 'dash' && !windows.get(target)) {
		const dashwin = new BrowserWindow({
			...commonopts,
			type: 'splash',
			title: `panic-shell-${target}`,
		});

		dashwin.setAlwaysOnTop(true, 'screen-saver');
		dashwin.on('blur', () => close('dash'));

		// Hack to capture escape and hide the app
		dashwin.webContents.on('before-input-event', (_, i) => {
			if (i.key !== 'Escape') return;
			close(target);
		});

		// Hack to force app protocol links to open the corresponding app
		dashwin.webContents.on('new-window', (e, url) => {
			e.preventDefault();
			shell.openExternal(url, { activate: true });
		});

		if (process.platform === 'darwin' && !!config.shortcut) {
			globalShortcut.register(config.shortcut, () => open(target));
		}

		dashwin.on('close', e => e.preventDefault());
		dashwin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
		dashwin.loadURL(url.href);
		windows.set(target, dashwin);	
	}

	if ((target === 'bar' || target === 'login') && !windows.get(target)) {
		const type = target === 'bar' ? 'dock' : 'dialog';
		const fullscreen = target === 'login';
		const wins = new Set();

		screens.forEach(s => {
			const { x, y, width } = s.bounds;
			const height = target === 'bar' ? 30 : s.bounds.height;
			const isPrimary = (x === primary.bounds.x) && (y === primary.bounds.y);

			if (target === 'bar') {
				url.pathname = 'bar';
				url.searchParams.delete('user');
				url.searchParams.set('output', isPrimary ? 1 : 2);
			}

			if (target === 'login') {
				url.searchParams.delete('output');
				url.searchParams.set('user', config.user);
				url.pathname = isPrimary ? 'login' : 'login/blank.html';
			}

			const win = new BrowserWindow({
				type,
				fullscreen,
				...commonopts,
				x, y, width, height,
				title: `panic-shell-${target}`,
			});

			if (target === 'login') win.setAlwaysOnTop(true, 'screen-saver');

			win.on('close', e => e.preventDefault());
			win.loadURL(url.href);
			win.screenBounds = { x, y, width, height };
			wins.add(win);
		});

		windows.set(target, wins);	
	}

	if (windows.get(target) instanceof Set) {
		windows.get(target).forEach(w => {
			w.setBounds(w.screenBounds, true);
			w.show();
		});
	} else {
		windows.get(target).setBounds(display.bounds, true);
		windows.get(target).show();
	}
}

function close(target) {
	if (!windows.get(target)) return;
	if (windows.get(target) instanceof Set) return windows.get(target).forEach(w => w.hide());
	windows.get(target).hide();
}