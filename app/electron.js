const ws = require('ws');
const logger = require('../lib/logger');
const config = require('../config.proxy');
const { dirs, platforms } = require('../consts');
const { app, BrowserWindow, screen, globalShortcut, shell } = require('electron');

if (!platforms.includes(process.platform)) {
	throw new Error(`Platform ${process.platform} not supported`);
	process.exit(1);
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

socket.on('message', msg => {
	const data = JSON.parse(msg);
	if (data.action === 'open') return open(data.target);
	if (data.action === 'close') return close(data.target);
	if (data.target === 'app'
		&& data.action === 'kill') {
		logger.log('Recieved KILL command for electron');
		if(windows.has('dash')) windows.get('dash').destroy();
		if(windows.has('launch')) windows.get('launch').destroy();
		if(windows.has('bar')) windows.get('bar').forEach(w => w.destroy());
		if(windows.has('locker')) windows.get('locker').forEach(w => w.destroy());
		return process.exit(0);
	}
});

function open(target) {
	// if(!config[target]) return;
	const screens = screen.getAllDisplays();
	const pos = screen.getCursorScreenPoint();
	const primary = screen.getPrimaryDisplay();
	const display = screen.getDisplayNearestPoint(pos);
	const url = new URL(`http://127.0.0.1:${config.port}`);
	url.pathname = target;

	if (target === 'launch' && !windows.get(target)) {
		const launchwin = new BrowserWindow({
			...commonopts,
			type: 'splash',
			title: `panic-osw-${target}`,
		});

		launchwin.webContents.on('before-input-event', (_, i) => {
			if (i.key !== 'Escape') return;
			close(target);
		});

		launchwin.on('close', e => e.preventDefault());
		launchwin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
		launchwin.loadURL(url.href);
		windows.set(target, launchwin);	
	}

	if (target === 'dash' && !windows.get(target)) {
		const dashwin = new BrowserWindow({
			...commonopts,
			type: 'splash',
			title: `panic-osw-${target}`,
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

	if ((target === 'bar' || target === 'locker') && !windows.get(target)) {
		const type = target === 'bar' ? 'dock' : 'dialog';
		const fullscreen = target === 'locker';
		const wins = new Set();

		screens.forEach(s => {
			const { x, y, width } = s.bounds;
			const height = target === 'bar' ? 30 : s.bounds.height;
			const isPrimary = (x === primary.bounds.x) && (y === primary.bounds.y);

			if (target === 'bar') {
				url.pathname = 'bar';
				url.searchParams.delete('user');
				url.searchParams.set('output', isPrimary ? `DP-1` : `DP-2`);
			}

			if (target === 'locker') {
				url.searchParams.delete('output');
				url.searchParams.set('user', config.user);
				url.pathname = isPrimary ? 'locker' : 'locker/blank.html';
			}

			const win = new BrowserWindow({
				type,
				fullscreen,
				...commonopts,
				x, y, width, height,
				title: `panic-osw-${target}`,
			});

			if (target === 'locker') win.setAlwaysOnTop(true, 'screen-saver');

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