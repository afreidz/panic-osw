<script>
	import { system } from './lib/actions';
	const { sleep, shutdown, restart, logout } = system;
</script>

<div class="power">
	<button on:click={sleep} class="fg_highlight_13">󰒲</button>
	<button on:click={shutdown} class="fg_highlight_18">󰐥</button>
	<button on:click={restart} class="fg_highlight_3">󰦛</button>
	<button on:click={logout} class="fg_highlight_5">󰗽</button>
</div>

<style>
	.power {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
	}

	button {
		width: 3rem;
		height: 3rem;
		cursor: pointer;
		font-size: 2rem;
		color: var(--color-light);
		border-radius: var(--value-radius);
		background: var(--color-panel-border-light);
	}
</style>
