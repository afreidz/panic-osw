<script>
	import { onMount } from 'svelte';
	import ApexCharts from 'apexcharts';
	let chart$;
	let chart;

	export let data = [];
	export let max = null;
	export let height = 330;
	export let highlight = 1;

	const opts = {
		chart: {
			type: 'area',
			height: `${height}px`,
			sparkline: { enabled: true },
			background: 'var(--color-panel)',
			animations: { enabled: true, easing: 'linear', dynamicAnimation: { speed: 300 }},
		},
		fill: {
			type: "gradient",
			gradient: { colorStops: [
				{ offset: 0, opacity: 0.15, color: `var(--color-highlight-${highlight})` },
				{ offset: 100, opacity: 0, color: `var(--color-highlight-${highlight})` },
			]}
		},
		series: [{ data }],
		zoom: { enabled: false },
		tooltip: { enabled: false},
		stroke: { curve: 'smooth', lineCap: 'round' },
		colors: [`var(--color-highlight-${highlight})`],
	};

	if(!!max) opts.yaxis = { min: 0, max };

	onMount(() => {
		chart = new ApexCharts(chart$, opts);
		chart.render();
	});

	$: if(!!chart && !!data) chart.updateSeries([{ data }]);
</script>

<figure bind:this={chart$}></figure>

<style>
	figure {
		color: var(--color-dark);
	}
</style>
