const gi = require('node-gtk');
const Gtk = gi.require('Gtk', '3.0');
const Gdk = gi.require('Gdk', '3.0');
const WebKit = gi.require('WebKit2');
const cmd = require('../lib/awaitcmd');
const logger = require('../lib/logger');
const config = require('../config.proxy');
const SocketClient = require('./lib/socket');
const priority = Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION;
const rgba = new Gdk.RGBA({ red: 0, green: 0, blue: 0, alpha: 0 });
const windowCache = new Map();

;(async () => {
	const socket = new SocketClient(`ws://127.0.0.1:${config.port}/all`,'ipc');
	await socket.ready;
	socket.on('open', open);
	socket.on('close', close);
	socket.on('kill', () => Gtk.mainQuit());
	gi.startLoop();
	Gtk.init();

	const screen = new Gdk.Screen.getDefault();
	const styles = new Gtk.CssProvider();

	styles.loadFromData(`
		#panic-osw-launch { background-color: rgba(0,0,0,0); }
	`);
	
	Gtk.StyleContext.addProviderForScreen(screen, styles, priority);
	Gtk.main();
})();

function open(target) {
	let cache = windowCache.has(target)
		? windowCache.get(target)
		: null;

	if (!cache) {
		const Screen = new Gdk.Screen.getDefault();
		const monitors = new Array(Screen.getNMonitors()).fill(null);

		if (target === 'bar') {
			const wins = [];
			monitors.forEach((_,i) => {
				const name = Screen.getMonitorPlugName(i);
				const geo = Screen.getMonitorGeometry(i);

				const win = new Gtk.Window({ name: `panic-osw-${target}`, title: `panic-osw-${target}` });
				const visual = win.getScreen().getRgbaVisual();
				const web = new WebKit.WebView();

				web.loadUri(`http://127.0.0.1:${config.port}/bar?output=${name}`);
				win.setTypeHint(Gdk.WindowTypeHint.DOCK);
				web.setBackgroundColor(rgba);
				win.setVisual(visual);
				win.add(web);
				win.showAll();

				win.window.moveResize(geo.x, geo.y, geo.width, 30);
				win.setResizable(false);
				wins.push(win);
			});
			windowCache.set(target, wins);
		} else if (target === 'locker') {
			const wins = [];
			monitors.forEach((_,i) => {
				const name = Screen.getMonitorPlugName(i);
				const geo = Screen.getMonitorGeometry(i);
				const type = i === 0 ? `panic-osw-${target}` : `panic-osw-${target}-blank`;
				const url = i === 0 
					? `http://127.0.0.1:${config.port}/locker?user=${config.user}`
					: `http://127.0.0.1:${config.port}/locker/blank.html`;

				const win = new Gtk.Window({ name: type, title: type });
				const visual = win.getScreen().getRgbaVisual();
				const web = new WebKit.WebView();

				win.setTypeHint(Gdk.WindowTypeHint.SPLASHSCREEN);
				web.setBackgroundColor(rgba);
				win.setVisual(visual);
				web.loadUri(url);
				win.add(web);
				win.showAll();

				win.window.moveResize(geo.x, geo.y, geo.width, geo.height);
				win.fullscreen();
				win.stick();
				wins.push(win);
			});
			windowCache.set(target, wins);
		} else {
			const win = new Gtk.Window({ name: `panic-osw-${target}`, title: `panic-osw-${target}` });
			const visual = win.getScreen().getRgbaVisual();
			const web = new WebKit.WebView();

			web.loadUri(`http://127.0.0.1:${config.port}/${target}`);
			win.setTypeHint(Gdk.WindowTypeHint.SPLASHSCREEN);
			web.setBackgroundColor(rgba);
			win.setVisual(visual);
			win.add(web);
			win.showAll();

			if (target === 'dash') {
				win.fullscreen();
				win.stick();
			}

			if (target === 'launch') {
				win.stick();
			}

			moveToScreen(win);
			windowCache.set(target, win);
		}
	} else {
		if (Array.isArray(cache)) {
			cache.forEach(w => w.showAll());
		} else {
			moveToScreen(cache);
			cache.showAll();
		}
	}
}

function close(target) {
	const win = windowCache.has(target)
		? windowCache.get(target)
		: null;

	if (Array.isArray(win)) {
		win.forEach(w => w.hide());
	} else if (win) {
		win.hide();
	}

	if (target === 'launch' && config.i3) {
		cmd(`i3-msg mode default`);
	}
}

function moveToScreen(w) {
	const screen = w.getScreen();
	const [,x,y] = screen
		.getDisplay()
		.getDefaultSeat()
		.getPointer()
		.getPosition();

	const mon = screen.getMonitorAtPoint(x,y);
	const geo = screen.getMonitorGeometry(mon);
	w.window.moveResize(geo.x, geo.y, geo.width, geo.height);
}