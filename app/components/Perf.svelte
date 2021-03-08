<script>
  import Chart from './Chart.svelte';
  import { cpuUsage, memUsage } from '../lib/dashState';

  export let highlights = [1,2];
  export let height = 345;
</script>

<div class="perf">
  <section>
    <strong>CPU</strong>
    <Chart data={$cpuUsage} height={height} highlight={highlights[0]} max={0.9} />
  </section>
  <section>
    <strong>MEM</strong>
    <Chart data={$memUsage} height={height} highlight={highlights[1]} max={0.9} />
  </section>
</div>

<style>
  section {
    margin-top: 2rem;
    position: relative;
    padding-bottom: 1rem;
  }

  section:first-child {
    border-bottom: 2px dashed var(--color-panel-border-light);
  }

  strong {
    margin: 1rem;
    font-weight: 700;
    font-size: 0.8rem;
    position: absolute;
    top: -2rem; right: 0;
    text-transform: uppercase;
  }
</style>