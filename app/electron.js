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

app.on('ready',() => console.log(screen.getAllDisplays()));
function open(target) {
	const screens = screen.getAllDisplays();
	const pos = screen.getCursorScreenPoint();
  const display = screen.getDisplayNearestPoint(pos);

	if (!!windows[target]) {
		if (target === 'bar') return windows.bar.forEach(b => b.show());
		windows[target].setBounds(display.bounds, true);
    windows[target].show();
	} else {
		if (target === 'bar') {
			windows.bar = [];
			screens.forEach(s => {
				const bar = new BrowserWindow({
					type: 'dock',
					...commonopts,
					...s.bounds, height: 30,
					title: 'panic-shell-bar',
		      webPreferences: { contextIsolation: true },
				});
				bar.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
				bar.loadURL(`http://127.0.0.1:${config.port}/bar?output=${s.bounds.x === 0 ? 2 : 1}`);
				windows.bar.push(bar);
				bar.show();
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

			windows[target].setBounds(display.bounds, true);
			windows[target].loadURL(`http://127.0.0.1:${config.port}/${target}`);
  		windows[target].setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
			windows[target].show();
		}
	}
}

function close(target) {
	if (target === 'bar') return windows.bar.forEach(b => b.hide());
	windows[target].hide();
}