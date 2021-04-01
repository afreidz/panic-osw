<script>
	import Me from './Me.svelte';
	import Perf from './Perf.svelte';
	import Todo from './Todo.svelte';
	import Wifi from './Wifi.svelte';
	import Power from './Power.svelte';
	import Music from './Music.svelte';
	import Clock from './Clock.svelte';
	import Widget from './Widget.svelte';
	import Screen from './Screen.svelte';
	import Volume from './Volume.svelte';
	import Battery from './Battery.svelte';
	import Calendar from './Calendar.svelte';
	import Ethernet from './Ethernet.svelte';
	import { widgets } from './lib/dashState';
	import Bluetooth from './Bluetooth.svelte';
	import Speedtest from './Speedtest.svelte';
	import Brightness from './Brightness.svelte';
	import IconLoader from '../public/icons/loader.svg';
</script>

<main>

	<Widget
		plain=true
		rowstart=1
		rowend=3
		colstart=1
		colend=5><Clock highlight=10/>
	</Widget>

	<Widget
		rowstart=3
		rowend=5
		colstart=1
		colend=5>
		<Me>
			<i slot="loading"><IconLoader/></i>
		</Me>
	</Widget>

	<Widget
		highlight=16
		rowstart=5
		rowend=6
		colstart=1
		colend=6>
		<Brightness highlight=19>
			<i slot="loading"><IconLoader/></i>
		</Brightness>
	</Widget>

	<Widget
		rowstart=6
		rowend=9
		colstart=1
		colend=6>
		<Screen>
			<i slot="loading"><IconLoader/></i>
		</Screen>
	</Widget>

	<Widget
		rowstart=1
		rowend=5
		colstart=5
		colend=10><Perf height=122 highlights={[16,5]} />
	</Widget>

	<Widget
		highlight=7
		rowstart=5
		rowend=7
		colstart=6
		colend=10><Music/>
	</Widget>

	<Widget
		rowstart=7
		rowend=9
		colstart=6
		colend=10><Speedtest/>
	</Widget>

	<Widget
		light={true}
		rowstart=1
		rowend=9
		colstart=10
		colend=14><Todo highlight=4 />
	</Widget>

	<Widget
		light=true
		rowstart=1
		rowend=3
		colstart=14
		colend=20><Calendar/>
	</Widget>

	<Widget
		rowstart=3
		rowend=4
		colstart=14
		colend=20><Power/>
	</Widget>

	<Widget
		highlight=12
		rowstart=4
		rowend=5
		colstart=14
		colend=20>
		<Volume highlight=19>
			<i slot="loading"><IconLoader/></i>
		</Volume>
	</Widget>

	<Widget
		highlight=11
		rowstart=5
		rowend=7
		colstart=14
		colend=18>
		<Bluetooth>
			<i slot="loading"><IconLoader/></i>
		</Bluetooth>
	</Widget>

	<Widget
		rowstart=7
		rowend=9
		colstart=14
		colend=18><Battery/>
	</Widget>

	<Widget
		highlight=10
		rowstart=5
		rowend=7
		colstart=18
		colend=20>
		<Ethernet>
			<i slot="loading"><IconLoader/></i>
		</Ethernet>
	</Widget>

	<Widget
		highlight=10
		rowstart=7
		rowend=9
		colstart=18
		colend=20>
			<Wifi>
				<i slot="loading"><IconLoader/></i>
			</Wifi>
	</Widget>

</main>

<style>
	main {
		display: grid;
		padding: var(--value-grid-gap);
		grid-gap: var(--value-grid-gap);
		padding-left: var(--value-grid-gap);
		grid-template-rows: repeat(var(--value-grid-rows), var(--value-grid-unit));
		grid-template-columns: repeat(var(--value-grid-cols), var(--value-grid-unit));
		width: calc((var(--value-grid-cols) * (var(--value-grid-unit) + var(--value-grid-gap))) + var(--value-grid-gap));
	}
</style>
