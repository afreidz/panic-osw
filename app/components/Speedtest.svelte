<script>
	import { speedtest } from './lib/dashState';
	import { network } from './lib/actions';

	let running = false;

	async function run() {
		running = true;
		const speed = await network.speedtest();
		speedtest.set(speed);
		running = false;
	}

	function formatTime(stamp) {
		const d = new Date(stamp);
		const opts = {
			month: 'short',
			day: 'numeric',
			weekday: 'short',
		};
		const date = d.toLocaleString('en-US', opts);
		const time = d.toLocaleTimeString('en-US');
		return `${date} @ ${time}`;
	}

</script>

<div class="speed">
	<header>
		<span><strong>󰓅</strong> Speedtest</span>
		<button class:running={running} disabled={running} on:click={run}>󰑓</button>
	</header>
	{#if $speedtest}
		<section>
			<small>Download <em>Mbps</em></small>
			<strong>{Math.round($speedtest.download)}</strong>
		</section>
		<section>
			<small>Upload <em>Mbps</em></small>
			<strong>{Math.round($speedtest.upload)}</strong>
		</section>
		<footer>
			<em>{formatTime($speedtest.timestamp)}</em>
		</footer>
	{/if}
</div>

<style>
	.speed {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}

	.speed header {
		width: 100%;
		margin: 1rem;
		display: flex;
		margin-bottom: 0;
		line-height: 1rem;
		align-self: flex-start;
		justify-content: space-between;
	}

	.speed footer {
		opacity: 0.3;
		font-size: 0.8rem;
		line-height: 0.8rem;
	}

	footer em {
		font-style: normal;
	}

	header button {
		opacity: 0;
		font-size: 1rem;
		cursor: pointer;
		background: none;
		line-height: 1rem;
		text-align: center;
		height: 1rem; width: 1rem;
		transform-origin: 0.44rem 0.43rem;
		transition: opacity var(--animation-slow);
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		0% { transform: rotate(-360deg); }
	}
	header button.running {
		animation: spin 1s linear infinite;
	}

	.speed:hover header button {
		opacity: 0.3;
	}

	header span {
		font-weight: 500;
	}

	header strong {
		opacity: 0.3;
	}

	.speed section {
		width: 50%;
		display: flex;
		text-align: center;
		flex-direction: column;
	}

	.speed section:first-of-type {
		border-right: 2px dashed var(--color-panel-border-light);
	}

	section small {
		font-size: 0.8rem;
		font-style: normal;
		font-weight: normal;
		line-height: 0.8rem;
	}

	section strong {
		font-size: 3rem;
		font-weight: 400;
		font-family: var(--value-font-mono);
	}

	section small {
		font-style: normal;
		color: var(--color-highlight-10);
	}

	section:first-of-type small {
		color: var(--color-highlight-7);
	}

	section small em {
		opacity: 0.3;
		font-style: normal;
		color: var(--color-light);
	}
</style>
