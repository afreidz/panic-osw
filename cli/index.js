#! /usr/bin/env node
const msg = require('./msg');
const run = require('./run');
const kill = require('./kill');
const setup = require('./setup');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

async function finish(e) {
	process.exit(await e);
}

yargs(hideBin(process.argv))
	.onFinishCommand(finish)
	.demandCommand(1, '')
	.command(setup)
	.command(kill)
	.command(msg)
	.command(run)
	.help()
	.argv;