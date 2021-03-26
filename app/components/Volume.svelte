<script>
  import { tick } from 'svelte';
  import { volume } from './lib/dashState';
  import { system } from './lib/actions';
  
  export let highlight = 0;
  let loading = true;
  let slider;
  let val;
  
  $: loading = !$volume;
  $: if($volume) setVal();

  async function setVal() {
    await tick();
    const sliderVal = Number(slider.value);
    const offset = sliderVal <= 40 ? 2 : sliderVal >= 65 ? -2 : 0;
    val.style.width = `${sliderVal+offset}%`;
    val.innerHTML = `${sliderVal}%`;
    await system.setVolume(sliderVal);
  }
</script>

<div class="volume" style="--slider-highlight-color: var(--color-highlight-{highlight});">
  <small class="label">Volume</small>
  {#if loading}
    <slot name="loading"></slot>
  {:else}
    <label class="slider">
      <span class="val" bind:this={val}>{$volume}%</span>
      <input on:input={setVal} bind:this={slider} type="range" value={$volume}>
    </label>
  {/if}
</div>

<style>
  .volume { 
    display: flex;
    padding: 0 1rem;
    margin-bottom: 1rem;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }

  .label {
    flex: 1;
    line-height: 2rem;
  }

  .slider {
    width: 100%;
    display: grid;
    height: 1.5rem;
    overflow: hidden;
    position: relative;
    border-radius: 2rem;
    background: var(--color-slider-bg);
  }

  .slider .val {
    width: 15%;
    height: 100%;
    font-size: 0px;
    grid-area: 1/1/1/1;
    background: var(--slider-highlight-color);
  }

  .slider input {
    outline: none;
    appearance: none;
    grid-area: 1/1/1/1;
    background: transparent;
  }

  .slider input::-webkit-slider-thumb {
    width: 1.5rem;
    height: 1.5rem;
    appearance:none;
    border-radius: 2rem;
    box-shadow: -1px 0 5px rgba(0,0,0,0.4);
    background: var(--slider-highlight-color);
  }

  .volume :global([slot="loading"]) {
    flex: 1;
    width: 100%;
    height: 1.5rem;
    text-align: center;
  }

  .volume :global([slot="loading"] svg) {
    height: 100%;
  }

</style>