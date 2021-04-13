<script>
  import { weather } from './lib/dashState';

  let highlight = null;
  $: highlight = $weather.code < 2000
    ? $weather.temp < 40
      ? 10 // cold
      : $weather.temp < 75
        ? 4 // warm
        : 3 // hot
    : $weather.code < 5000
      ? 20 // gloom/fog
      : 10; // snow
</script>

<div class="weather bg_highlight_{highlight}">
  <em>{$weather.icon}</em>
  <strong>{$weather.temp}&deg;</strong>
  <small>{$weather.text}</small>
</div>

<style>
  .weather {
    text-align: center;
  }

  em {
    display: block;
    font-size: 4rem;
    font-style: normal;
  }

  strong {
    display: block;
    font-size: 1.5rem;
  }

  small {
    opacity: 0.6;
  }
</style>