<script>
  import { onMount } from 'svelte';
  import { visible } from './lib/state';

	export let highlight = 0;
	export let type = 'dash';

	let hr = '00';
	let mn = '00';
	let mm = '00';
	let dd = '00';
	let yy = '00';

	function set(){
		const date = new Date();
		let h = date.getHours();
		dd = ("0" + date.getDate()).slice(-2);
		mn = ("0" + date.getMinutes()).slice(-2);
		yy = ("0" + date.getFullYear()).slice(-2);
		mm = ("0" + (date.getMonth()+1)).slice(-2);
		hr = ("0" + (h > 12 ? (h-12) : h)).slice(-2);
	}

	function reload() {
		window.location.reload();
	}

	onMount(set);
	setInterval(set, 1000);
  $: if ($visible) set();
</script>

{#if type === 'bar'}
	<p on:click={reload} class="bar">󰅐 {hr}:{mn}</p>
{:else}
	<p class="dash">
		<strong>{hr}<span class="fg_highlight_{highlight}">{mn}</span></strong>
		<small>{mm}/<span class="fg_highlight_{highlight}">{dd}</span>/{yy}</small>
	</p>
{/if}
<style>
	p.dash {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		font-family: var(--value-font-mono);
	}

	p.dash strong {
		font-size: 5rem;
		font-weight: 400;
	}

	p.dash small {
		font-weight: 400;
		font-size: 1rem;
	}

	p.bar {
		font-weight: bold;
		color: var(--color-text);
	}
</style>
