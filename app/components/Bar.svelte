<script>
	import Clock from './Clock.svelte';
	import { workspace } from './lib/actions';
	import { workspaces, mode } from './lib/barState';

	const icons = ['󰎤','󰎧','󰎪','󰎭','󰎱','󰎳','󰎶','󰎹','󰎼'];
	let widgets = ['clock'];

	async function handle(ws) {
		await workspace.activate(ws);
	}
</script>

<div class="workspaces">
	<button class="mode">{$mode}</button>
	{#each $workspaces as workspace }
		<button
			class:visible={workspace.visible}
			class:focused={workspace.focused}
			class:urgent={workspace.urgent}
			on:click={() => handle(workspace.num)}>
			<i>{icons[workspace.num-1]}</i>
		</button>
	{/each}
</div>
<div class="widgets">
	{#if widgets.includes('clock')}
		<Clock type="bar" highlight={12} />
	{/if}
	{#if widgets.includes('power')}
		<span class="widget power">󰐥</span>
	{/if}
</div>

<style>
	.workspaces {
		grid-column: 2;
		text-align: center;
	}

	.widgets {
		grid-column: 3;
		text-align: right;
		margin-right: 1rem;
	}

	button {
		padding: 0;
		width: 2rem;
		border: none;
		height: 2rem;
		margin: 0 1px;
		outline: none;
		font-size: 2rem;
		background: none;
		line-height: 2rem;
		-webkit-appearance: none;
		color: var(--color-text);
	}

	button > i {
		margin-top: -2px;
		font-style: normal;
		display: inline-block;
	}

	.visible {
		color: var(--color-highlight-14);
	}

	.focused {
		color: var(--color-highlight-12);
		text-shadow: var(--value-font-shadow);
	}

	.urgent, .widget.power {
		color: var(--color-highlight-1);
	}

	.mode {
		color: var(--color-highlight-10);
	}

	.widget {
		color: var(--color-text);
		align-self: flex-end;
	}

	.widget.power {
		font-size: 2rem;
		line-height: 2rem;
	}
</style>
