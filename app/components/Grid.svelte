<script>
	import Me from './Me.svelte';
	import Perf from './Perf.svelte';
	import Todo from './Todo.svelte';
	import Wifi from './Wifi.svelte';
	import Power from './Power.svelte';
	import Music from './Music.svelte';
	import Clock from './Clock.svelte';
	import Widget from './Widget.svelte';
	import Toggle from './Toggle.svelte';
	import Screen from './Screen.svelte';
	import Volume from './Volume.svelte';
	import Battery from './Battery.svelte';
	import Calendar from './Calendar.svelte';
	import Ethernet from './Ethernet.svelte';
	import Bluetooth from './Bluetooth.svelte';
	import Speedtest from './Speedtest.svelte';
	import Brightness from './Brightness.svelte';
	import IconBulb from '../public/icons/bulb.svg';
	import IconLoader from '../public/icons/loader.svg';
</script>

<main>
	<Widget
		plain=true
		rowstart=1
		rowend=3
		colstart=1
		colend=5>
			<Clock highlight=10/>
	</Widget>
	<Widget
		highlight=16
		rowstart=5
		rowend=6
		colstart=1
		colend=6>
			<Brightness highlight=19><i slot="loading"><IconLoader/></i></Brightness>
	</Widget>
	<Widget
		rowstart=3
		rowend=5
		colstart=12
		colend=14>
			<Toggle main="Desk Lamp" sub="Office" device="21705065bcddc28db9c3" spot=1 highlight=1>
				<i slot="loading"><IconLoader/></i>
				<i slot="on"><IconBulb state="on"/></i>
				<i slot="off"><IconBulb state="off"/></i>
			</Toggle>
	</Widget>
	<Widget
		rowstart=3
		rowend=5
		colstart=10
		colend=12>
			<Toggle main="Edison Lamp" sub="Office" device="21705065bcddc28db9c3" spot=2 highlight=2>
				<i slot="loading"><IconLoader/></i>
				<i slot="on"><IconBulb state="on"/></i>
				<i slot="off"><IconBulb state="off"/></i>
			</Toggle>
	</Widget>
	<Widget
		rowstart=1
		rowend=3
		colstart=10
		colend=12>
			<Toggle main="Shelf Lamp" sub="Office" device="15764628dc4f22f5f185" highlight=3>
				<i slot="loading"><IconLoader/></i>
				<i slot="on"><IconBulb state="on"/></i>
				<i slot="off"><IconBulb state="off"/></i>
			</Toggle>
	</Widget>
	<Widget
		highlight=10
		rowstart=3
		rowend=5
		colstart=14
		colend=16>
		<Ethernet><i slot="loading"><IconLoader/></i></Ethernet>
	</Widget>
	<Widget
		highlight=10
		rowstart=5
		rowend=7
		colstart=14
		colend=16>
			<Wifi><i slot="loading"><IconLoader/></i></Wifi>
	</Widget>
	<Widget
		highlight=11
		rowstart=1
		rowend=3
		colstart=12
		colend=16>
		<Bluetooth><i slot="loading"><IconLoader/></i></Bluetooth>
	</Widget>
	<Widget
		highlight=7
		rowstart=5
		rowend=7
		colstart=6
		colend=10>
		<Music/>
	</Widget>
	<Widget
		rowstart=5
		rowend=7
		colstart=10
		colend=14>
		<Speedtest/>
	</Widget>
	<Widget
		rowstart=1
		rowend=5
		colstart=5
		colend=10>
			<Perf height=122 highlights={[16,5]} />
	</Widget>
	<Widget
		rowstart=3
		rowend=5
		colstart=1
		colend=5>
			<Me><i slot="loading"><IconLoader/></i></Me>
	</Widget>
	<Widget
		highlight=12
		rowstart=7
		rowend=8
		colstart=12
		colend=16>
			<Volume highlight=19><i slot="loading"><IconLoader/></i></Volume>
	</Widget>
	<Widget
		light=true
		rowstart=7
		rowend=9
		colstart=6
		colend=12>
			<Calendar/>
	</Widget>
	<Widget
		rowstart=6
		rowend=9
		colstart=1
		colend=6>
			<Screen><i slot="loading"><IconLoader/></i></Screen>
	</Widget>
	<Widget
		light={true}
		rowstart=1
		rowend=7
		colstart=16
		colend=20>
			<Todo highlight=4 />
	</Widget>
	<Widget
		rowstart=7
		rowend=9
		colstart=16
		colend=20>
			<Battery/>
	</Widget>
	<Widget
		rowstart=8
		rowend=9
		colstart=12
		colend=16>
			<Power/>
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

	main>:global(*) {
		transition: opacity var(--animation-slow);
	}
</style>
