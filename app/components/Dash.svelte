<script>
  import Grid from './Grid.svelte';
  import { socket } from '../lib/socket';
  import { visible } from '../lib/state';

  socket.send({ action: $visible ? 'active' : 'idle' });
  
  document.addEventListener('visibilitychange', () => {
    const isVisible = !document.hidden;
    visible.set(isVisible);
    socket.send({ action: isVisible ? 'active' : 'idle' });
    document.body.classList.toggle('visible', isVisible);
  });
</script>

<div class="container">
  <Grid />
</div>