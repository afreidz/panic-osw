<script>
	import Grid1 from './Grid1.svelte';
	import Grid2 from './Grid2.svelte';
	import { socket } from './lib/socket';
	import { visible } from './lib/state';
	import { widgets } from './lib/dashState';

	socket.send({ action: $visible ? 'active' : 'idle' });

	document.addEventListener('visibilitychange', () => {
		const isVisible = !document.hidden;
		visible.set(isVisible);
		socket.send({ action: isVisible ? 'active' : 'idle' });
		document.body.classList.toggle('visible', isVisible);
	});
</script>

{#if !!$widgets}
	<div class="container">
		{#if $widgets.devices}
			<Grid1/>
		{:else}
			<Grid2/>
		{/if}
	</div>
{/if}
