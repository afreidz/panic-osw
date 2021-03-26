<script>
  import { wifi } from './lib/dashState';
  import IconWifi from '../public/icons/wifi.svg';

  let loading = true;
  $: loading = !$wifi;
</script>

<button class="wifi">
  {#if loading}
    <slot name="loading"/>
  {:else}
    {#if !$wifi.ssid && !$wifi.ip }
      <i class="icon"><IconWifi on={false}/></i>
      <strong>Wifi off</strong>
      <small>not connected</small>
    {:else}
      <i class="icon"><IconWifi on={true}/></i>
      <strong>{$wifi.ssid}</strong>
      <small>{$wifi.ip}</small>
    {/if}
  {/if}
</button>

<style>
  .wifi {
    outline: none;
    display: flex;
    cursor: pointer;
    background: none;
    position: relative;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }

  .icon {
    width: 5rem;
    height: 5rem;
    margin-bottom: 0.5rem;
  }

  strong, small {
    font-size: 0.8rem;
    line-height: 1rem;
    font-weight: normal;
  }

  small { opacity: 0.5; }
</style>