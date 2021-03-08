const path = require('path');
const css = require('rollup-plugin-css-only');
const svelte = require('rollup-plugin-svelte');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve').default;
const production = !process.env.ROLLUP_WATCH;

module.exports = {
	input: {
		bar: path.join(__dirname, 'views', 'bar.js'),
		dash: path.join(__dirname, 'views', 'dash.js'),
		login: path.join(__dirname, 'views', 'login.js'),
		settings: path.join(__dirname, 'views', 'settings.js'),
	},
	output: {
		format: 'esm',
		sourcemap: true,
		entryFileNames: '[name].mjs',
		dir: path.join(__dirname, 'public', 'build'),
	},
	plugins: [
		svelte({ compilerOptions: { dev: !production }, extensions: ['.svelte', '.svg'] }),
		css({ output: 'styles.css' }),
		resolve({ browser: true, dedupe: ['svelte'] }),
		commonjs(),
	],
	watch: { clearScreen: false },
};