const util = require('util');
const exec = util.promisify(require('child_process').exec);

class Client {
	constructor(binary) {
		this.binary = binary;
	}

	exec(args, cb) {
		return exec(`${this.binary} ${args}`);
	}

	get windows() {
		const wins = [];
		return new Promise(async (r,e) => {
			const { stdout } = await this.exec('-t get_tree');
			const tree = JSON.parse(stdout);
			walk(tree, wins);
			r(wins);
		});
	}

	async run(opts) {
		const wins = await this.windows;
		const win = opts.class
			? wins.find(w => w.className.includes(opts.class))
			: opts.title
				? wins.find(w => w.name.includes(opts.title))
				: null;
		if (win) return this.exec(`"[con_id=${win.id}] focus"`);
		if (opts.cmd) return this.exec(`'exec --no-startup-id ${opts.cmd}'`);
	}

}

function walk(tree, windows) {
	if (tree.window) {
		windows.push({
			name: tree.name,
			id: tree.id,
			focused: tree.focused,
			window: tree.window,
			workspace: tree.workspace,
			className: tree['window_properties']['class']
		});
	}
	if (tree.nodes) {
		tree.nodes.forEach(function (subTree) {
			walk(subTree, windows);
		});
	}
}

module.exports = Client;
