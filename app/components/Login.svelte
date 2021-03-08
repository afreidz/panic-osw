<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { system } from '../lib/actions';

	let ready = false;
	let auth = {};
	let user;

	onMount(() => ready = true);

	$: if (ready && !!user ) user.focus();

	async function login() {
		await system.login(auth);
	}
</script>

<div class="login">
	{#if ready}
		<form on:submit|preventDefault={login} in:fly="{{ delay: 300, duration: 1000, y: 20, opacity: 0 }}">
			<figure class="fg_highlight_11">󰣇</figure>
			<h1>
				<strong>Welcome</strong> to <strong class="fg_highlight_11">Arch</strong> on <strong>nuc</strong>...</h1>
			<label>
				<input type="text" name="user" bind:value={auth.user} bind:this={user}/>
				<span>󰭕</span>
			</label>
			<label>
				<input type="password" name="pass" bind:value={auth.pass}/>
				<span>󰟵</span>
			</label>
			<button class="bg_highlight_11">login</button>
		</form>
	{/if}
</div>

<style>
	@keyframes lava-fg {
		0% { color: var(--color-highlight-1); }
		5.88% { color: var(--color-highlight-2); }
		11.76% { color: var(--color-highlight-3); }
		17.64% { color: var(--color-highlight-4); }
		23.52% { color: var(--color-highlight-5); }
		29.4% { color: var(--color-highlight-6); }
		35.28% { color: var(--color-highlight-7); }
		41.16% { color: var(--color-highlight-8); }
		47.04% { color: var(--color-highlight-9); }
		52.92% { color: var(--color-highlight-10); }
		58.8% { color: var(--color-highlight-11); }
		64.68% { color: var(--color-highlight-12); }
		70.56% { color: var(--color-highlight-13); }
		76.44% { color: var(--color-highlight-14); }
		82.32% { color: var(--color-highlight-15); }
		88.2% { color: var(--color-highlight-16); }
		94.08% { color: var(--color-highlight-17); }
		100% { color: var(--color-highlight-18); }
	}

	@keyframes lava-bg {
		0% { background-color: var(--color-highlight-1); }
		5.88% { background-color: var(--color-highlight-2); }
		11.76% { background-color: var(--color-highlight-3); }
		17.64% { background-color: var(--color-highlight-4); }
		23.52% { background-color: var(--color-highlight-5); }
		29.4% { background-color: var(--color-highlight-6); }
		35.28% { background-color: var(--color-highlight-7); }
		41.16% { background-color: var(--color-highlight-8); }
		47.04% { background-color: var(--color-highlight-9); }
		52.92% { background-color: var(--color-highlight-10); }
		58.8% { background-color: var(--color-highlight-11); }
		64.68% { background-color: var(--color-highlight-12); }
		70.56% { background-color: var(--color-highlight-13); }
		76.44% { background-color: var(--color-highlight-14); }
		82.32% { background-color: var(--color-highlight-15); }
		88.2% { background-color: var(--color-highlight-16); }
		94.08% { background-color: var(--color-highlight-17); }
		100% { background-color: var(--color-highlight-18); }
	}

	.login {
		flex: 1;
		display: flex;
		min-height: 100%;
		align-items: center;
		padding-bottom: 1rem;
		flex-direction: column;
		justify-content: center;
	}

	figure {
		display: block;
		font-size: 10rem;
		text-align: center;
	}

	form {
		display: flex;
		overflow: hidden;
		flex-direction: column;
		background: var(--color-1);
		border-radius: var(--value-radius);
		box-shadow: var(--value-box-shadow);
	}

	h1 {
		font-weight: 200;
		text-align: center;
		margin-bottom: 1rem;
		color: var(--color-4);
	}

	strong {
		font-weight: 600;
		color: var(--color-light);
	}

	label {
		display: grid;
		margin: 1rem 4rem;
		grid-template-columns: 3rem auto;
		grid-template-areas: 'label input';
	}

	label:first-of-type {
		margin-top: 2rem;
	}

	label:last-of-type {
		margin-bottom: 4rem;
	}

	label span {
		font-size: 3rem;
		grid-area: label;
	}

	label input {
		border: none;
		outline: none;
		margin: 0.5rem;
		padding: 0.5rem;
		grid-area: input;
		font-size: 1.5rem;
		background: transparent;
		border-bottom: 1px solid var(--color-4);
	}

	label input:focus + span {
		color: var(--color-light);
	}

	label input:focus {
		border-color: var(--color-light);
	}

	button {
		padding: 2rem;
		font-weight: 800;
		font-size: 1.5rem;
		border: 1px solid rgba(0,0,0,0);
		border-bottom-left-radius: var(--value-radius);
		border-bottom-right-radius: var(--value-radius);
	}

	button:focus {
		border-color: var(--color-light);
		text-shadow: var(--value-font-shadow);
	}

	span {
		height: 1rem;
		color: var(--color-4);
	}
</style>