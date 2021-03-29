<script>
  export let rowend = 0;
  export let colend = 0;
  export let rowstart = 0;
  export let colstart = 0;
  export let dark = false;
  export let highlight = 0;
  export let plain = false;
  export let light = false;
</script>

<div 
  class:dark={dark}
  class:plain={plain} 
  class:light={light}
  class="widget bg_highlight_{highlight}"
  style="grid-area:{rowstart} / {colstart} / {rowend} / {colend};">
  <slot></slot>
</div>

<style>
  .widget {
    display: flex;
    overflow: hidden;
    align-items: stretch;
    border-radius: var(--value-radius);
    box-shadow: var(--value-box-shadow);
    background-color: var(--color-panel);
  }

  .widget>:global(*) {
    flex: 1;
  }

  .widget.plain, .widget.highlight_0 {
    background-color: var(--color-panel);
  }

  .widget.light {
    color: var(--color-text-alt);
    background: var(--color-panel-alt);
  }

  .widget.dark {
    background: var(--color-1);
  }

  .widget :global(svg .fill *) {
    fill: var(--color-text);
  }

  .widget :global(svg .stroke *) {
    stroke: var(--color-text);
  }
</style>