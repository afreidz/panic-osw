<script>
	import { battery } from '../lib/dashState';
</script>

<div class="battery">
  <small class="label">Battery</small>
  <div class="container">
  	<div 
  		class="value strong"
  		style="width: {$battery}%;"
  		class:weak={$battery < 40}
  		class:ok={$battery < 60}
  		class:infinite={$battery === 999}>
  		<span>{#if $battery === 999}󰚥{:else}{$battery}%{/if}</span>
  	</div>
  </div>
</div>

<style>
	.battery { 
    display: flex;
    padding: 0 1rem;
    margin-bottom: 1rem;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }

  .label {
    height: 2rem;
    line-height: 2rem;
  }

  .container {
  	flex: 1;
  	overflow: hidden;
  	position: relative;
  	border-radius: 8px;
  	align-self: stretch;
  	background: var(--color-slider-bg);
  }

  .value {
  	display: flex;
  	text-align: center;
  	position: absolute;
  	align-items: center;
  	justify-content: center;
  	top: 0; bottom: 0; left: 0;
  	color: rgba(var(--rgb-8), 0.6);
  	background: var(--color-highlight-5);
  }

  .value.infinite {
  	width: 100% !important;
  }

  .value.infinite > span {
  	font-size: 3rem;
  	transform: rotate(90deg);
  }

  .value.ok {
  	background: var(--color-highlight-4);
  }

  .value.weak {
  	background: var(--color-highlight-1);
  }
</style>