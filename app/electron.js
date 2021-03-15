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

const socket = new ws(`ws://127.0.0.1:${config.port}/all`);
const commonopts = {
  frame: false,
  moveable: false,
  resizeable: false,
  transparent: true,
  maximizeable: false,
  minimizeable: false,
  simpleFullscreen: true,
};
const windows = {
	bar: null,
	dash: null,
	login: null,
};

socket.on('message', msg => {
	const data = JSON.parse(msg);
	if (data.action === 'open') return open(data.target);
	if (data.action === 'close') return close(data.target);
});

function open(target) {
	const screens = screen.getAllDisplays();
	const pos = screen.getCursorScreenPoint();
  const primary = screen.getPrimaryDisplay();
  const display = screen.getDisplayNearestPoint(pos);
  let url = `http://127.0.0.1:${config.port}/${target}`;

	if (!!windows[target]) {
		if (target === 'bar' || target === 'login') return windows[target].forEach(w => w.show());
		windows[target].setBounds(display.bounds, true);
    windows[target].show();
	} else {
		if (target === 'bar' || target === 'login') {
			windows[target] = [];
			screens.forEach(s => {
				if (target === 'bar') url = `${url}?output=${s.bounds.x === primary.bounds.x ? 1 : 2}`;
				if (target === 'login') url = `${url}${s.bounds.x !== primary.bounds.x ? '/blank.html' : ''}`;
				const win = new BrowserWindow({
					type: 'dock',
					...commonopts,
					...s.bounds, 
					title: `panic-shell-${target}`,
		      webPreferences: { contextIsolation: true },
					height: target === 'bar' ? 30 : s.bounds.height,
				});
				win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
				win.loadURL(url);
				windows[target].push(win);
				win.show();
			});
		} else {
			windows[target] = new BrowserWindow({
				...commonopts,
	      type: 'splash',
	      fullscreen: true,
	      title: `panic-shell-${target}`,
	      webPreferences: {
	        contextIsolation: true,
	        backgroundThrottling: target !== 'dash',
	      },
			});

			if (target === 'dash') {
    		windows.dash.setAlwaysOnTop(true, 'screen-saver');
		    windows.dash.on('blur', () => close('dash'));

		    // Hack to capture escape and hide the app
		    windows.dash.webContents.on('before-input-event', (_, i) => {
		      if (i.key !== 'Escape') return;
		      close('dash');
		    });

		    // Hack to force app protocol links to open the corresponding app
		    windows.dash.webContents.on('new-window', (e, url) => {
		      e.preventDefault();
		      shell.openExternal(url, { activate: true });
		    });

		    if (process.platform === 'darwin' && !!config.shortcut) {
		      globalShortcut.register(config.shortcut, () => open('dash'));
		    }
			}

			if (process.platform === 'darwin') {
				windows[target].setFullScreenable(false);
			}

			windows[target].loadURL(url);
			windows[target].setBounds(display.bounds, true);
  		windows[target].setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
			windows[target].show();
		}
	}
}

function close(target) {
	if (target === 'bar') return windows.bar.forEach(b => b.hide());
	windows[target].hide();
}