<script>
	import { onMount } from 'svelte';
	import Widget from './Widget.svelte';
	import { system } from './lib/actions';

	export let showSecret = false;

	const defaults = {
		music: {},
		networking: {},
		devices: { configured: [], },
	};

	onMount(async () => {
		const data = await system.getSettings();
		settings = { ...defaults, ...data.settings };
		values = data.values;
	});

	let settings;
	let values;
	let form;

	async function addDevice() {
		settings.devices.configured = [...settings.devices.configured, {}];
	}

	async function removeDevice(device) {
		let confirm = await confirmRemove();
		if(!confirm) return;
		settings.devices.configured = settings.devices.configured.filter(d => d !== device);
		update();
	}

	function confirmRemove() {
		return new Promise((resolve, reject) => {
			const confirmed = window.confirm('Are you sure you want to remove this device?');
			return confirmed ? resolve(true) : reject(false);
		});
	}

	async function update() {
		settings.devices.configured = settings.devices.configured.filter(d => (Object.keys(d).length !== 0));
		await system.settings(settings);
	}
</script>

<Widget dark={true}>
	{#if !!settings}
		<form bind:this={form} on:change={update} action="/" method="POST">
			<header>
				<h1>Settings</h1>
			</header>
			<section>
				<h2>General</h2>
				<label>
					<span>Display Name</span>
					<input name="name" type="text" maxlength=30 bind:value={settings.name} required placeholder="Enter Your Display Name" />
				</label>
				<label class="select">
					<span>Linux User</span>
					<select name="user" bind:value={settings.user} required>
						<option value="">Select a user</option>
						{#each values.users as u}
							<option value={u} selected={u === settings.user}>{u}</option>
						{/each}
					</select>
				</label>
				<label class="port">
					<span>HTTP/Socket Port</span>
					<input name="port" type="number" min=43 max=65535 bind:value={settings.port} required placeholder="Enter A Port" />
				</label>
				<label>
					<span>i3wm</span>
					<input name="i3" type="checkbox" bind:checked={settings.i3} />
				</label>
				<label>
					<span>feh</span>
					<input name="feh" type="checkbox" bind:checked={settings.feh} />
				</label>
				{#if !settings.feh}
					<label>
						<span>Wallpaper Path</span>
						<input name="wallpaper" type="text" bind:value={settings.wallpaper} required />
					</label>
				{/if}
			</section>
			<section>
				<h2>Networking</h2>
				<label class="select">
					<span>Wifi Interface</span>
					<select name="wififace" bind:value={settings.networking.wifi} required>
						<option value="">Select A Network Interface</option>
						{#each values.interfaces || [] as i}
							<option value={i}>{i}</option>
						{/each}
					</select>
				</label>
				<label class="select">
					<span>Ethernet Interface</span>
					<select name="ethiface" bind:value={settings.networking.eth} required>
						<option value="">Select A Network Interface</option>
						{#each values.interfaces || [] as i}
							<option value={i}>{i}</option>
						{/each}
					</select>
				</label>
			</section>
			<section>
				<h2>Music 󰓇</h2>
				<label>
					<span>Refresh Token</span>
					<input name="musicRefresh" type="password" bind:value={settings.music.refresh} required/>
				</label>
				<label>
					<span>Authorization API URL</span>
					<input name="musicAuth" type="text" bind:value={settings.music.auth}/>
				</label>
				<label>
					<span>API URL</span>
					<input name="musicAPI" type="text" bind:value={settings.music.api}/>
				</label>
				<label>
					<span>API Key</span>
					<input name="musicKey" type="text" bind:value={settings.music.key} required />
				</label>
				<label>
					<span>API Secret</span>
					<input name="musicSecret" type="password" bind:value={settings.music.secret} required />
				</label>
			</section>
			{#if showSecret}
				<section class="devices">
					<h2>Devices (SECRECT)</h2>
					<label>
						<span>API URL</span>
						<input name="devicesURL" type="text" bind:value={settings.devices.url}/>
					</label>
					<label>
						<span>API Key</span>
						<input name="devicesKey" type="text" bind:value={settings.devices.key}/>
					</label>
					<label>
						<span>API Secret</span>
						<input name="devicesSecret" type="password" bind:value={settings.devices.secret}/>
					</label>
					{#if settings.devices.configured }
						<h2>Configured Devices:</h2>
					{/if}
					{#each (settings.devices?.configured || []) as device, i}
						<div class="device">
							<label>
								<span>Device ID</span>
								<input name="device_{i}" type="text" bind:value={device.id} required/>
							</label>
							<label class="spot">
								<span>Spot</span>
								<input name="device_{i}_spot" type="number" bind:value={device.spot}/>
							</label>
							<button on:click|preventDefault={() => removeDevice(device)}>󰅗</button>
						</div>
					{/each}
					<button on:click|preventDefault={addDevice}>󰐖 Add Device</button>
				</section>
			{/if}
		</form>
	{/if}
</Widget>

<style>
	form {
		color: var(--color-text);
	}

	header {
		position: relative;
	}

	h1 {
		margin: 2rem;
		font-size: 2rem;
		font-weight: 500;
		text-align: center;
		text-shadow: var(--value-font-shadow);
	}

	h2 {
		padding: 1rem;
		font-weight: 300;
		text-align: left;
		font-size: 1.5rem;
	}

	section {
		margin: 1rem 2rem;
		text-align: center;
		padding-bottom: 1rem;
		background: var(--color-panel);
		border-radius: var(--value-radius);
	}

	label {
		padding: 1rem;
		display: grid;
		max-width: 66%;
		margin: 0 auto;
		position: relative;
		align-items: center;
		grid-gap: var(--value-grid-gap);
		grid-template-columns: 15rem auto;
	}

	label > span {
		font-weight: 400;
		justify-self: end;
	}

	label > input, label > select {
		outline: none;
		font-size: 1rem;
		font-weight: 300;
		line-height: 2rem;
		padding: 0.5rem 1rem;
		-webkit-appearance: none;
		background: var(--color-1);
		border-radius: var(--value-radius);
	}

	label.select:after {
		width: 2rem;
		opacity: 0.4;
		height: 2rem;
		content: '󰁊';
		font-size: 1.5rem;
		position: absolute;
		pointer-events: none;
		right: 1.5rem; top: 1.5rem;
	}

	label > input[type="checkbox"] {
		width: 2rem;
		height: 2rem;
		border-radius: 0;
		-webkit-appearance: none;
	}

	label > input[type="checkbox"]:checked {
		border-color: var(--color-highlight-10);
		background-color: var(--color-highlight-10);
	}

	label > input[type="checkbox"]:checked:after {
		content: '󰸞';
		display: flex;
		font-size: 1.5rem;
		align-items: center;
		justify-content: center;
		color: var(--color-light);
		width: 100%; height: 100%;
	}

	.devices button {
		outline: none;
		margin: 0.5rem;
		padding: 1rem 2rem;
		background: var(--color-1);
		border-radius: var(--value-radius);
	}

	.device {
		display: flex;
	}

	.device label {
		grid-template-columns: 10rem auto;
	}

	.device label.spot {
		grid-template-columns: 6rem 6rem;
	}

	button:focus {
		box-shadow: var(--value-box-shadow);
		text-shadow: var(--value-font-shadow);
	}

	label > input::placeholder { opacity: 0.5; }
	label.port > input { max-width: 10rem; text-align: center; }
	label > input:focus, label > select:focus { border-color: var(--color-highlight-10); }
</style>
