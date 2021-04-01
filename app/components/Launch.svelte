<script>
	import Fuse from 'fuse.js';
	import { visible } from './lib/state';
	import { system } from './lib/actions';
	import { fade } from 'svelte/transition';
	import { apps } from './lib/launchState';
	let current = null;
	let items = [];
	let matches;
	let input;
	let fuse;
	let q;

	$: if (input) input.focus();
	$: if ($apps) fuse = new Fuse($apps, { keys: ['Name', 'GenericName']});
	$: if (matches && !current) current = matches[0];
	$: if (visible) q = '';

	function search(e) {
		if (e.key === 'Escape') q = '';
		if (e.key === 'Enter') return send(e);
		if (e.key === 'ArrowUp') return prev(e);
		if (e.key === 'ArrowDown') return next(e);
		current = null;
		matches = fuse.search(q);
	}

	function next(e) {
		if (e) e.preventDefault();
		const match = matches.findIndex(e => e.Name === current?.Name);
		const index = match < 0 ? 0 : match+1 > (matches.length-1) ? 0 : match+1;
		current = matches[index];
		items[index].scrollIntoViewIfNeeded(false);
	}

	function prev(e) {
		if (e) e.preventDefault();
		const match = matches.findIndex(e => e.Name === current?.Name);
		const index = match-1 >= 0 ? match-1 : matches.length-1;
		current = matches[index];
		items[index].scrollIntoViewIfNeeded(true);
	}

	function send(e) {
		if (e) e.preventDefault();
		system.launch(current);
		q = '';
	}

	document.addEventListener('visibilitychange', () => {
	const isVisible = !document.hidden;
	visible.set(isVisible);
	});
</script>

{#if $visible}
<div class="search" in:fade={{ duration: 50 }}>
	<input type="text" bind:this={input} on:keydown={search} bind:value={q}/>
	{#if matches}
	<ul>
		{#each matches as m, i}
			<li bind:this={items[i]} class:focused={m === current}>{m.Name}</li>
		{/each}
	</ul>
	{/if}
</div>
{/if}

<style>
	.search {
		width: 800px;
		align-self: center;
		background: var(--color-2);
		border-radius: var(--value-radius);
		box-shadow: var(--value-box-shadow);
	}

	input {
		border: none;
		outline: none;
		padding: 1.5rem;
		font-size: 2rem;
		font-weight: 500;
		background: transparent;
	}

	ul {
		width: 800px;
		overflow: auto;
		position: fixed;
		list-style: none;
		font-weight: 300;
		max-height: 23rem;
		color: var(--color-light);
		background: var(--color-2);
	}

	ul li {
		padding: 0.5rem 1.5rem;
	}

	li.focused {
		font-weight: 500;
		background: var(--color-highlight-10);
	}
</style>
