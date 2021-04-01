#! /usr/bin/env node
const run = require('./run');
const open = require('./open');
const kill = require('./kill');
const close = require('./close');
const setup = require('./setup');
const launch = require('./launch');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

async function finish(e) {
	process.exit(await e);
}

yargs(hideBin(process.argv))
	.onFinishCommand(finish)
	.demandCommand(1, '')
	.command(launch)
	.command(setup)
	.command(close)
	.command(open)
	.command(kill)
	.command(run)
	.help()
	.argv;
