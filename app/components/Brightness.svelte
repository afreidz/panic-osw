<script>
  import { tick } from 'svelte';
  import { system } from './lib/actions';
  import { brightness, brightnessEnabled as enabled } from './lib/dashState';
  
  export let highlight = 0;
  let loading = true;
  let slider;
  let val;
  
  $: loading = !$brightness;
  $: if(!!$brightness) setVal($brightness);

  async function setVal(b) {
    await tick();
    
    const sliderVal = !!b
      ? 100*b-30
      : Number(slider.value);

    const offset = sliderVal <= 40 
      ? 2 
      : sliderVal >= 65 
        ? -1 
        : 0;

    const adjusted = (10 * sliderVal + 300)/1000;

    val.style.width = `${sliderVal+offset}%`;
    val.innerHTML = `${sliderVal}%`;

    if(!b) {
      $brightness = adjusted;
      await system.setBrightness(adjusted);
    } else {
      slider.value = sliderVal;
    }
  }
</script>

<div class="brightness" style="--slider-highlight-color: var(--color-highlight-{highlight});">
  <small class="label">Brightness</small>
  {#if loading}
    <slot name="loading"></slot>
  {:else}
    <label class="slider" class:disabled={!$enabled}>
      <span class="val" bind:this={val}>{$brightness}%</span>
      <input min="0" max="100" step="1" disabled={!$enabled} on:input={() => setVal()} bind:this={slider} type="range"/>
    </label>
  {/if}
</div>

<style>
  .brightness { 
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

  .slider.disabled {
    opacity: 0.5;
  }

  .slider input::-webkit-slider-thumb {
    width: 1.5rem;
    height: 1.5rem;
    appearance:none;
    border-radius: 2rem;
    box-shadow: -1px 0 5px rgba(0,0,0,0.4);
    background: var(--slider-highlight-color);
  }

  .brightness :global([slot="loading"]) {
    flex: 1;
    width: 100%;
    height: 1.5rem;
    text-align: center;
  }

  .brightness :global([slot="loading"] svg) {
    height: 100%;
  }

</style>