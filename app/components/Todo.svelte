<script>
  import { todos } from '../lib/dashState';

  export let highlight = 0;
  let editing = null;

  function create() {
    const id = Number(new Date);
    const todo = {
      id,
      done: false,
      sub: 'details',
      title: `Title for ${id}`,
    }
    $todos = [ todo, ...$todos ];
  }

  function deleteTd(id) {
    $todos = $todos.filter(t => t.id !== id);
  }

  function clear() {
    $todos = $todos.filter(t => !t.done);
  }
</script>

<div class="todolist">
  <header class="bg_highlight_{highlight}">
    <button on:click={clear}>󰱢</button>
    <span>todos</span>
    <button on:click={create}>󰜄</button>
  </header>
  {#if $todos && $todos.length === 0 }
    <main class="empty">all caught up</main>
  {/if}
  <ul>
    {#each $todos as todo}
      <li class:editing={editing === todo.id}>
        <label>
          <input type="checkbox" bind:checked={todo.done} />
          <strong>
            {#if editing === todo.id }
              <input bind:value={todo.title}/>
            {:else}
              <span>{todo.title}</span>
            {/if}
          </strong>
          <small>
            {#if editing === todo.id }
              <input bind:value={todo.sub}/>
            {:else}
              <span>{todo.sub}</span>
            {/if}
          </small>
        </label>
        <div class="actions">
          {#if editing === todo.id}
            <button on:click={() => editing = null}>󰸞</button>
          {:else}
            <button on:click={() => editing = todo.id}>󰲶</button>
          {/if}
          <button on:click={() => deleteTd(todo.id)}>󰩺</button>
        </div>
      </li>
    {/each}
  </ul>
</div>

<style>
  .todolist {
    overflow: auto;
    position: relative;
    min-height: min-content;
  }

  .empty {
    opacity: 0.3;
    margin: auto;
    font-weight: 300;
    max-height: 1rem;
    top: 0; bottom: 0;
    left: 0; right: 0;
    position: absolute;
    text-align: center;
  }

  header {
    top: 0;
    height: 4rem;
    display: flex;
    position: sticky;
    font-weight: 500;
    align-items: center;
    color: var(--color-light);
    background: var(--color-4);
    justify-content: space-between;
    border-bottom: 1px solid var(--color-panel-border);
  }

  header button {
    width: 2rem;
    margin: 1rem;
    cursor: pointer;
    font-size: 1.5rem;
    background-color: transparent;
    border-radius: var(--value-radius);
    transition: background-color var(--animation-slow);
  }

  header button:hover {
    background-color: rgba(var(--rgb-8), 0.3);
  }
  
  label {
    display: grid;
    padding: 1rem;
    padding-left: 0px;
    grid-template-rows: auto auto;
    grid-template-columns: 3em auto;
    grid-template-areas: 'check title' 'check sub';
  }
  
  li {
    display: grid;
    margin: 0.5rem;
    background: var(--color-light);
    grid-template-columns: auto 2rem;
    border-radius: var(--value-radius);
  }
  
  input { 
    grid-area: check; 
    align-self: center; 
    justify-self: center; 
  }

  strong { 
    display: flex;
    grid-area: title;
    font-weight: normal;
    justify-content: space-between;
  }
  
  small {
    display: flex; 
    grid-area: sub;
    font-size: 0.8rem;
    justify-content: space-between;
  }

  small span { opacity: 0.3; }

  .actions {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-evenly;
  }

  .actions button {
    opacity: 0;
    width: 100%;
    flex-grow: 1;
    background: none;
    transition: opacity var(--animation-fast);
  }

  .actions button:focus,
  .actions:hover button:focus,
  .editing .actions button:focus {
    opacity: 1;
    color: var(--color-highlight-12);
  }

  .actions:hover button,
  .editing .actions button {
    opacity: 0.3;
  }
</style>