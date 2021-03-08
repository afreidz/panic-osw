<script>
  import { devices } from '../lib/dashState';
  import { devices as deviceActions } from '../lib/actions';

  let data = null;
  let loading = true;
  export let spot = null;
  export let device = null;
  export let highlight = 0;
  export let sub = "Switch";
  export let main = "Toggle";

  $: if (!device) loading = false;
  $: if (!!device) loading = !data; 
  $: if ($devices && device) data = !!spot ? $devices[device][spot] : $devices[device][0];

  async function toggle() {
    data = null;
    await deviceActions.toggle(device, spot);
  }
</script>


<div class="container">
  {#if loading}
      <slot name="loading" />
  {:else}
      <button on:click={toggle} class:enabled={data.value} class="button bg_highlight_{highlight}">
        {#if data.value}
          <slot name="on" />
        {:else}
          <slot name="off" />
        {/if}
      </button>
  {/if}
  <strong>{main}</strong>
  <small>{sub}</small>
</div>
{#if false}<slot></slot>{/if} <!--Hack to prevent default slot warning-->

<style>
  .container {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background: none;
    border: none;
    outline: none;
  }

  strong, small {
    line-height: 1rem;
    font-weight: normal;
  }

  .container>.button, .container :global(i[slot="loading"]) {
    box-shadow: var(--value-box-shadow);
    border-radius: var(--value-radius);
    margin: 1rem 0.5rem;
    cursor: pointer;
    padding: 0.5rem;
    height: 4.5rem;
    width: 4.5rem;
    margin-top: 0;
  }

  small { opacity: 0.5; }
</style>

