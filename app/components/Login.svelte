<script>
	import { onMount, tick } from 'svelte';
	import { visible } from './lib/state';
	import { system } from './lib/actions';
	import { whoami } from './lib/loginState';
	import { fly, fade } from 'svelte/transition';

	let processing = false;
	let state = null;
	let focus;
	let pass;

	$: if (!!focus) focus.focus();

	async function login() {
		state = null;
		processing = true;
		
		try {
			await system.login($whoami, pass);
			processing = false;
			state = true;
			pass = null;
			await new Promise(r => setTimeout(r, 2000));
			state = null;
		} catch (err) {
			processing = false;
			state = false;
			await tick();
			focus.select();
		}
	}

	document.addEventListener('visibilitychange', () => {
    const isVisible = !document.hidden;
    visible.set(isVisible);
    socket.send({ action: isVisible ? 'active' : 'idle' });
    document.body.classList.toggle('visible', isVisible);
  });
</script>

<div class="login">
	{#if $visible}
		<figure in:fade>󰣇</figure>
		<form on:submit|preventDefault={login} in:fly={{ y: 20, delay: 300 }}>
			<input type="hidden" name="user" bind:value={$whoami} />
			<label class:error={state === false} class:success={state === true}>
				<img src="/me/avatar" alt="avatar">
				<input 
					name="pass" 
					type="password" 
					bind:value={pass} 
					bind:this={focus}
					disabled={!!processing}
					on:input={() => state = null}
					placeholder="password for {$whoami}"/>
			</label>
		</form>
	{/if}
</div>

<style>
	.login {
		flex: 1;
		display: flex;
		min-height: 100%;
		align-items: center;
		padding-bottom: 1rem;
		flex-direction: column;
		justify-content: center;
	}

	form {
		display: flex;
	}	

	label {
		display: flex;
		font-size: 1rem;
		overflow: hidden;
		border-radius: var(--value-radius);
    box-shadow: var(--value-box-shadow);
    background-color: var(--color-panel);
	}

	label > img {
		height: 5rem;
		padding: -3px;
	}

	input {
		outline: none;
		padding-left: 1rem;
		background: transparent;
		border: 3px solid transparent;
		transition: border var(--animation-slow);
		border-top-right-radius: var(--value-radius);
		border-bottom-right-radius: var(--value-radius);
	}

	input:disabled {
		opacity: 0.3;
	}
	
	input::placeholder {
		color: rgba(255,255,255,0.2);
	}

	label.error input {
		border-color: var(--color-highlight-1);
	}

	label.success input {
		border-color: var(--color-highlight-5);
	}

	figure {
		right: 1rem;
		bottom: 1rem;
		font-size: 2rem;
		position: absolute;
		color: var(--color-panel);
	}
</style>