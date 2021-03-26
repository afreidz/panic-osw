<script>
  import { onMount } from 'svelte';
  import { visible } from './lib/state';
  
  let timer;
  let events;
  let thisWeek;
  let nextWeek;
  const today = new Date;

  $: thisWeek = [];
  $: nextWeek = [];
  $: events = new Map;

  onMount(setCalendar);
  $: if (!$visible) clearInterval(timer);
  $: if ($visible) timer = setInterval(setCalendar, 10000);
  
  function setCalendar() {
    const temp = new Date(today);
    const thisSunday = new Date(temp.setDate(today.getDate() - today.getDay()));
    const nextSunday = new Date(temp.setDate(thisSunday.getDate() + 7));

    thisWeek = [];
    nextWeek = [];

    for (const idx of [0,1,2,3,4,5,6]) {
      thisWeek.push(new Date(temp.setDate(thisSunday.getDate() + idx)));
      nextWeek.push(new Date(temp.setDate(nextSunday.getDate() + idx)));
    }
  }
</script>

<div class="calendar">
  <aside class="date">
    <strong>{today.toLocaleString('en-us', { weekday: 'long' })}</strong>
    <small>{today.toLocaleString('en-us', { month: 'long' })}</small>
    <em>{today.getDate()}</em>
  </aside>
  <section class="grid">
    <em>SUN</em>
    <em>MON</em>
    <em>TUE</em>
    <em>WED</em>
    <em>THU</em>
    <em>FRI</em>
    <em>SAT</em>
    {#each thisWeek as day}
      <button 
        class:hasEvent={events.has(day.getDate())} 
        class:today={day.getDate() === today.getDate()}>
        {day.getDate()}
      </button>
    {/each}
    {#each nextWeek as day}
      <button class:hasEvent={events.has(day.getDate())}>
        {day.getDate()}
      </button>
    {/each}
  </section>
</div>

<style>
  .calendar { 
    flex: 1;
    display: flex;
    justify-content: space-around;
  }

  .date {
    display: grid;
    justify-content: center;
    margin: 1rem 0 1rem 1rem;
    grid-template-rows: 1.5rem 1.5rem auto;
  }

  .date strong {
    opacity: 0.3;
    font-size: 0.8rem;
    text-align: center;
    align-self: center;
    line-height: 1.5rem;
    font-weight: normal;
    text-transform: uppercase;
  }

  .date small {
    font-size: 1.25rem;
    text-align: center;
    align-self: center;
    color: var(--color-highlight-1);
  }

  .date em {
    font-size: 5rem;
    line-height: 5rem;
    text-align: center;
    font-style: normal;
  }

  .grid {
    flex-grow: 1;
    margin: 1rem;
    display: grid;
    max-width: 350px;
    grid-template-rows: 1.5rem 3rem 3rem;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  }

  .grid em {
    opacity: 0.3;
    align-self: center;
    font-size: 0.8rem;
    font-style: normal;
    text-align: center; 
  }

  .grid button { 
    margin: 2px;
    background: var(--color-light);
    border-radius: var(--value-radius); 
  }

  .grid .today, .grid .hasEvent {
    color: var(--color-light);
  }

  .grid .today {
    background: var(--color-highlight-1);
  }
</style>