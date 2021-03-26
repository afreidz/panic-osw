<script>
  import { bluetooth } from './lib/dashState';
  import IconBluetooth from '../public/icons/bluetooth.svg';

  export let size = "double";

  let loading = true;
  $: loading = !$bluetooth;
</script>

<div class="bluetooth {size}">
  {#if loading }
    <slot name="loading"/>
  {:else}
    <section class="status">
      <i class="icon"><IconBluetooth state={$bluetooth.power} /></i>
      <strong>Bluetooth {#if $bluetooth.power}on{:else}off{/if}</strong>
    </section>
    <section class="devices">
      {#if $bluetooth.devices.length > 0}
        <ul>
          {#each $bluetooth.devices as device}
            <li>
              <strong title="{device.name}">{device.name}</strong>
              <small>{#if device.connected}connected{:else}not connected{/if}</small>
            </li>
          {/each}
        </ul>
      {:else}
        <small>no paired devices</small>
      {/if}
    </section> 
  {/if}
</div>

<style>
  .bluetooth {
    display: flex;
    overflow: hidden;
  }

  section {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }

  .icon {
    width: 5rem;
    height: 5rem;
    margin-bottom: 0.5rem;
  }

  .icon :global(svg) {
    width: 90%;
    height: 90%;
  }

  .status strong {
    font-size: 0.8rem;
    line-height: 1rem;
    font-weight: normal;
    margin-bottom: 1rem;
  }

  small { 
    opacity: 0.3;
    align-self: center;
    justify-self: center;
  }

  .single section:first-child {
    width: 100%;
    flex-shrink: 0;
  }

  .double section:first-child {
    width: 45%;
    flex-shrink: 0;
  }

  .bluetooth :global(i[slot="loading"]) {
    width: 100%;
    height: 5rem;
    align-self: center;
    text-align: center;
  }

  .bluetooth :global(i[slot="loading"] svg) {
    height: 5rem;
  }

  .bluetooth :global(svg .off *) {
    stroke: var(--color-highlight-16);
  }

  .devices {
    flex-grow: 1;
    overflow: auto;
    align-items: stretch;
  }

  .devices ul {
    margin-top: 1rem;
    list-style: none;
  }

  .devices li {
    padding: 0.75rem;
    margin-right: 1rem;
    margin-bottom: 0.5rem;
    border-radius: var(--value-radius);
    background: rgba(var(--rgb-8), 0.1);
  }

  .devices strong {
    overflow: hidden;
    font-weight: 700;
    font-size: 0.8rem;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    text-transform: uppercase;
    -webkit-box-orient: vertical;
  }
</style>