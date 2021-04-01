<script>
	import { ethernet } from './lib/dashState';
	import IconEthernet from '../public/icons/ethernet.svg';

	let loading = true;
	$: loading = !$ethernet;
</script>

<button class="ethernet">
	{#if loading}
		<slot name="loading"/>
	{:else}
		{#if !$ethernet.connected }
			<i class="icon"><IconEthernet on={false}/></i>
			<strong>Disconnected</strong>
			<small></small>
		{:else}
			<i class="icon"><IconEthernet on={true}/></i>
			<strong>Connected</strong>
			<small>{$ethernet.ip}</small>
		{/if}
	{/if}
</button>

<style>
	.ethernet {
		outline: none;
		display: flex;
		cursor: pointer;
		background: none;
		position: relative;
		align-items: center;
		flex-direction: column;
		justify-content: center;
	}

	.icon {
		width: 5rem;
		height: 5rem;
		margin-bottom: 0.5rem;
	}

	strong, small {
		line-height: 1rem;
		font-weight: normal;
	}

	small { opacity: 0.5; }
</style>
