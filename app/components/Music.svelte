<script>
  import { song } from './lib/dashState';
  import { music } from './lib/actions';
</script>

<div class="music">
  <i on:click={() => window.open('spotify://home')}>󰓇</i>
  {#if $song?.image}
    <img src={$song?.image} alt={$song?.title} />
  {:else}
    <button><span>󰓇</span></button>
  {/if}
  <strong title="{$song?.title || 'Nothing Playing'}">{$song?.title || 'Nothing Playing'}</strong>
  <em title="{$song?.artist || ''}">{$song?.artist || ''}</em>
  <small title="{$song?.album || ''}">{$song?.album || ''}</small>
  <section class="controls">
    <button on:click={music.prev}>󰼨</button>
    <button on:click={$song.playing ? music.pause : music.play }>{#if $song?.playing}󰏤{:else}󰐊{/if}</button>
    <button on:click={music.next}>󰼧</button>
  </section>
  {#if !!$song}<progress value={$song.elapsed} max={$song.length} />{/if}
</div>

<style>
  .music {
    padding: 1rem;
    display: grid;
    padding-right: 0;
    position: relative;
    align-items: start;
    justify-content: center;
    grid-template-columns: 8rem auto;
    grid-template-rows: 1.25rem 1.25rem auto auto 1rem;
    grid-template-areas: 'pic title' 'pic artist' 'pic album' 'pic controls' 'timer timer';
  }

  .music > button {
    width: 7rem;
    height: 7rem;
    display: grid;
    grid-area: pic;
    font-size: 5rem;
    align-items: center;
    justify-content: center;
    color: var(--color-dark);
    border-radius: var(--value-radius);
    background: rgba(var(--rgb-8), 0.3);
  }

  .music > button span {
    opacity: 0.3;
  }

  i {
    opacity: 0.5;
    position: absolute;
    font-style: normal;
    color: var(--color-dark);
    top: 0.5rem; right: 0.5rem;
  }

  img {
    height: 7rem;
    grid-area: pic;
    border-radius: var(--value-radius);
  }

  section {
    display: flex;
    margin-right: 1rem;
    align-self: center;
    grid-area: controls;
    justify-content: space-between;
  }

  section button {
    opacity: 0.3;
    padding: 0.5rem;
    font-size: 2rem;
    cursor: pointer;
    background: none;
    line-height: 2rem;
    color: var(--color-dark);
    transition: opacity var(--animation-fast),
      color var(--animation-fast);
  }

  section button:hover {
    opacity: 1;
    color: var(--color-light);
  }

  strong, em {
    font-weight: 600;
    overflow: hidden;
    grid-area: title;
    line-height: 1.5;
    margin-right: 1.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  em {
    margin-top: 0;
    font-size: 0.9rem;
    grid-area: artist;
    margin-right: 1rem;
    font-style: normal;
    font-weight: normal;
  }

  small {
    opacity: 0.3;
    line-height: 2;
    overflow: hidden;
    grid-area: album;
    font-size: 0.8rem;
    margin-right: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    color: var(--color-dark);
    -webkit-box-orient: vertical;
  }

  progress {
    height: 2px;
    align-self: end;
    appearance: none;
    grid-area: timer;
    margin-left: -1rem;
    width: calc(var(--value-grid-unit)*4 + (var(--value-grid-gap)*3));
  }

  progress::-webkit-progress-bar {
    background-color: var(--color-dim);
  }

  progress::-webkit-progress-value {
    background-color: var(--color-light);
    transition: width 1s linear;
  }
</style>