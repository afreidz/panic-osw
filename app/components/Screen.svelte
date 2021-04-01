<script>
	import { displays } from './lib/dashState';
	import IconMonitor from '../public/icons/monitor.svg';
	let orientation = 'horizontal';
	let loading = true;
	let data;

	export let index = null;

	$: loading = !$displays;
	$: if(!!$displays && !index) data = $displays;
	$: if(!!$displays && index) data = [$displays[index]];
	$: if(!!$displays && $displays.length === 2 && !index) {
		const secondary = $displays.find(d => !d.primary);
		orientation = secondary.pos.x > secondary.pos.y
			? 'horizontal'
			: 'vertical';
	}
</script>

<div class="displays {orientation}" class:single={data && data.length === 1}>
	{#if loading}
		<slot name="loading"/>
	{:else if data}
		{#each data as display}
			<div class="display">
				<div class="monitor">
					<figure style="background-size: {display.singleWallpaper ? '200% auto' : 'auto 100%' }; background-image: url(/display/wallpaper/{index || 0}); background-position-x: {(display.pos.x === 1920 && display.singleWallpaper) ? '-100%' : 'left'};"></figure>
					<IconMonitor/>
				</div>
				<legend>
					<ul>
						<li><span class="key">ID: </span><span class="val">{display.id}</span></li>
						<li><span class="key">Resolution: </span><span class="val">{display.res?.x}x{display.res?.y}</span></li>
						<li>
							<span class="key">
								{#if display.primary}Primary:{:else}&nbsp;{/if}
							</span>
							<span class="val">
								{#if display.primary}{display.primary}{:else}&nbsp;{/if}
							</span>
						</li>
					</ul>
				</legend>
			</div>
		{/each}
	{/if}
</div>

<style>
	.displays {
		display: grid;
		padding: 2rem;
		grid-template-rows: 100%;
		grid-template-columns: 50% 50%;
	}

	.displays.single {
		grid-template-rows: 100%;
		grid-template-columns: 100%;
	}

	.vertical.displays {
		height: 100%;
		grid-template-rows: 50% 50%;
		grid-template-columns: 100%;
	}

	.display {
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: auto 5rem;
	}

	.vertical .display {
		grid-template-rows: 100%;
		grid-template-columns: 50% 50%;
	}

	.single .display {
		grid-template-columns: 100%;
		grid-template-rows: auto 3rem;
	}

	.monitor {
		width: 99%;
		display: grid;
		margin-bottom: 1rem;
		justify-content: center;
		grid-template-rows: auto;
		grid-template-columns: auto;
	}

	.vertical .monitor {
		margin-bottom: 5px;
	}

	.monitor figure {
		grid-area: 1/1/1/1;
		border-radius: 10px;
		margin: 2.4% 2.5% 16.2% 2.5%;
		background-position-y: center;
	}

	.monitor :global(svg) {
		width: 100%;
		grid-area: 1/1/1/1;
	}

	.vertical .monitor :global(svg),
	.single .monitor :global(svg) {
		width: auto;
		height: 100%;
	}

	.displays :global(i) {
		display: flex;
		grid-column: span 2;
		align-items: center;
		justify-content: center;
	}

	.displays :global(i svg) {
		height: 5rem;
	}

	.vertical.displays :global(i) {
		grid-column: 1 1;
		grid-row: span 2;
	}

	.display :global(svg .fill) {
		fill: var(--color-4);
	}

	legend {
		font-size: 0.8rem;
		align-self: center;
	}

	legend ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	legend li {
		display: flex;
	}

	.key {
		width: 5rem;
		opacity: 0.3;
		text-align: right;
		margin-right: 0.5rem;
	}

	.val { font-weight: 600; }
</style>
