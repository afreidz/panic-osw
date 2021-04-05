<script>
	import inside from './lib/inside';
	import Grid1 from './Grid1.svelte';
	import Grid2 from './Grid2.svelte';
	import { socket } from './lib/socket';
	import { visible } from './lib/state';
	import { widgets } from './lib/dashState';

	let showSettings = false;
	let settings;

	function check(e) {
		const point = { x: e.x, y: e.y };
		const target = {
			x: settings.offsetLeft + settings.offsetWidth / 2,
			y: settings.offsetTop + settings.offsetHeight / 2,
		}
		showSettings = inside(target, 100, point);
	}

	socket.send({ action: $visible ? 'active' : 'idle' });

	document.addEventListener('visibilitychange', () => {
		const isVisible = !document.hidden;
		visible.set(isVisible);
		socket.send({ action: isVisible ? 'active' : 'idle' });
		document.body.classList.toggle('visible', isVisible);
	});
</script>

<svelte:window on:mousemove={check} />

{#if !!$widgets}
	<a href="/settings" class:show={showSettings} bind:this={settings}>󰒓</a>
	<div class="container">
		{#if $widgets.devices}
			<Grid1/>
		{:else}
			<Grid2/>
		{/if}
	</div>
{/if}

<style>
	a, a:active, a:visited {
		opacity: 0;
		border: none;
		width: 2.5rem;
		outline: none;
		height: 2.5rem;
		background: none;
		font-size: 2.5rem;
		position: absolute;
		font-style: normal;
		text-decoration: none;
		top: 2rem; right: 2rem;
		/*color: rgba(var(--rgb-1), 0.7);*/
		transition: opacity var(--animation-slow);
	}

	a.show {
		opacity: 1;
	}
</style>
