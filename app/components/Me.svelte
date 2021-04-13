<script>
	import { me } from './lib/dashState';

  export let orientation = 'horizontal';

	let loading = true;
	$: loading = !$me;
</script>

<div class="me" class:vertical={orientation !== 'horizontal'}>
	{#if loading }
		<slot name="loading" />
	{:else}
		<img src='/me/avatar' alt="Avatar">
		<strong>{$me.name}</strong>
		<small>{$me.whoami}</small>
	{/if}
</div>

<style>
	.me {
		display: grid;
		grid-template-rows: auto auto;
		grid-template-columns: 30% auto;
	}

  .me.vertical {
    display: block;
    text-align: center;
  }

  .me.vertical img {
    margin: 1rem auto;
  }

	img {
		width: 5rem;
		margin: 1rem;
		height: 5rem;
    display: block;
		grid-row: span 2;
		align-self: center;
		border-radius: 8px;
		justify-self: center;
		box-shadow: var(--value-box-shadow);
	}

	strong {
    display: block;
		font-weight: normal;
		align-self: flex-end;
	}
	small {
		opacity: 0.3;
    display: block;
	}
</style>
