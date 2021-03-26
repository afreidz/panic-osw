<script>
  import { me } from './lib/dashState';
  
  let loading = true;
  $: loading = !$me;
</script>

<div class="me">
  {#if loading }
    <slot name="loading" />
  {:else}
    <img src='/me/avatar' alt="Avatar">
    <strong>{$me.name}</strong>
    <small>{$me.whoami}</small>
  {/if}
</div>

<style>
  .me {
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: 30% auto;
  }

  img {
    width: 5rem;
    margin: 1rem;
    height: 5rem;
    grid-row: span 2;
    align-self: center;
    justify-self: center;
    border-radius: var(--value-radius);
    box-shadow: var(--value-box-shadow);
  }

  strong {
    font-weight: normal;
    align-self: flex-end;
  }
  small {
    opacity: 0.3;
  }
</style>
