<script>
  import { onMount } from 'svelte';
  import Widget from './Widget.svelte';
  import { system } from '../lib/actions';

  export let showSecret = false;
  let settings;
  let form;

  onMount(async () => {
    settings = await (await fetch('/system/settings')).json();
  });

  $: if (settings && settings.wm !== 'i3') settings.bar = false;

  function addDevice() {
    settings.devices.configured = [...(settings.devices.configured || []), {}];
  }

  async function removeDevice(device) {
    let confirm = await confirmRemove();
    if(!confirm) return;
    settings.devices.configured = settings.devices.configured.filter(d => d !== device);
    update();
  }

  function confirmRemove() {
    return new Promise((resolve, reject) => {
      const confirmed = window.confirm('Are you sure you want to remove this device?');
      return confirmed ? resolve(true) : reject(false);
    });
  }

  async function update() {
    settings.devices.configured = (settings.devices.configured || []).filter(d => (Object.keys(d).length !== 0));
    await system.settings(settings);
  }
</script>

<Widget light={true}>
  {#if !!settings}
    <form bind:this={form} on:change={update} action="/" method="POST">
      <header>
        <h1>Settings</h1>
        <h3 class:error={settings.values.depErrors}>
          Dependency Check
          {#if settings.values.depErrors}󱎘{:else}󰸞{/if}
        </h3>
      </header>
      <section>
        <h2>General</h2>
        <label>
          <span>Name</span>
          <input name="name" type="text" maxlength=30 bind:value={settings.name} required placeholder="Enter Your Display Name" />
        </label>
        {#if settings.values.wms.length !== 0}
        <label class="select">
          <span>Window Manager</span>
          <select name="windowManager" bind:value={settings.wm} required>
            <option value="">Select A Window Manager</option>
            {#each settings.values.wms as w}
            <option value={w}>{w}</option>
            {/each}
          </select>
        </label>
        {/if}
        {#if settings.values.wallpaper}
          <label class="select">
            <span>Wallpaper Application</span>
            <select name="wallpapeProvider" bind:value={settings.wallpaper.provider} required>
              <option value="">Select A Wallpaper App</option>
              {#each settings.values.wallpaper as w}
                <option value={w}>{w}</option>
              {/each}
            </select>
          </label>
        {/if}
        {#if settings.values.platform === 'darwin'}
        <label>
          <span>Keyboard Shortcut</span>
          <input name="shortcut" type="text" bind:value={settings.shortcut}/>
        </label>
        {/if}
        <label class="port">
          <span>Port</span>
          <input name="port" type="number" min=43 max=65535 bind:value={settings.port} required placeholder="Enter A Port" />
        </label>
        {#if settings.wm === 'i3'}
          <label>
            <span>Enable Bar</span>
            <input name="bar" type="checkbox" bind:checked={settings.bar} />
          </label>
        {/if}
        <label class="checkbox">
          <span>Enable Dashboard</span>
          <input name="dash" type="checkbox" bind:checked={settings.dash} />
        </label>
        <label class="checkbox">
          <span>Enable Login</span>
          <input name="login" type="checkbox" bind:checked={settings.login} />
        </label>
      </section>
      <section>
        <h2>Networking</h2>
        <label class="select">
          <span>Wifi Interface</span>
          <select name="wififace" bind:value={settings.networking.wifi} required>
            <option value="">Select A Network Interface</option>
            {#each settings.values.networking as i}
              <option value={i}>{i}</option>
            {/each}
          </select>
        </label>
        <label class="select">
          <span>Ethernet Interface</span>
          <select name="ethiface" bind:value={settings.networking.eth} required>
            <option value="">Select A Network Interface</option>
            {#each settings.values.networking as i}
              <option value={i}>{i}</option>
            {/each}
          </select>
        </label>
      </section>
      <section>
        <h2>Music (Spotify)</h2>
        <label>
          <span>Refresh Token</span>
          <input name="musicRefresh" type="password" bind:value={settings.music.refresh} required/>
        </label>
        <label>
          <span>Authorization API URL</span>
          <input name="musicAuth" type="text" bind:value={settings.music.auth}/>
        </label>
        <label>
          <span>API URL</span>
          <input name="musicAPI" type="text" bind:value={settings.music.api}/>
        </label>
        <label>
          <span>API Key</span>
          <input name="musicKey" type="text" bind:value={settings.music.key} required />
        </label>
        <label>
          <span>API Secret</span>
          <input name="musicSecret" type="password" bind:value={settings.music.secret} required />
        </label>
      </section>
      {#if showSecret}
        <section class="devices">
          <h2>Devices (SECRECT)</h2>
          <label>
            <span>API URL</span>
            <input name="devicesURL" type="text" bind:value={settings.devices.url}/>
          </label>
          <label>
            <span>API Key</span>
            <input name="devicesKey" type="text" bind:value={settings.devices.key}/>
          </label>
          <label>
            <span>API Secret</span>
            <input name="devicesSecret" type="password" bind:value={settings.devices.secret}/>
          </label>
          {#if settings.devices.configured }
            <h2>Configured Devices:</h2>
          {/if}
          {#each (settings.devices.configured || []) as device, i}
            <div class="device">
              <label>
                <span>Device ID</span>
                <input name="device_{i}" type="text" bind:value={device.id} required/>
              </label>
              <label class="spot">
                <span>Spot</span>
                <input name="device_{i}_spot" type="number" bind:value={device.spot}/>
              </label>
              <button on:click|preventDefault={() => removeDevice(device)}>󰅗</button>
            </div>
          {/each}
          <button on:click|preventDefault={addDevice}>󰐖 Add Device</button>
        </section>
      {/if}
    </form>
  {/if}
</Widget>

<style>
  header {
    position: relative;
  }

  h1 {
    margin: 2rem;
    font-size: 2rem;
    font-weight: 500;
    text-align: center;
    color: var(--color-highlight-10);
    text-shadow: var(--value-font-shadow);
  }

  h2 {
    margin: 1rem;
    font-weight: 200;
    text-align: left;
    font-size: 1.5rem;
  }

  h3 {
    top: 1rem;
    right: 2rem;
    font-size: 1rem;
    font-weight: 500;
    position: absolute;
    color: var(--color-highlight-5);
  }
  h3.error {
    color: var(--color-highlight-1);
  }

  section {
    margin: 1rem 2rem;
    text-align: center;
    padding-bottom: 1rem;
    background: var(--color-7);
    border-radius: var(--value-radius);
    border: 1px solid rgba(0,0,0,0.2);
  }

  label {
    padding: 1rem;
    display: grid;
    max-width: 66%;
    margin: 0 auto;
    position: relative;
    align-items: center;
    grid-gap: var(--value-grid-gap);
    grid-template-columns: 15rem auto;
  }

  label > span {
    font-weight: 400;
    justify-self: end;
  }

  label > input, label > select {
    outline: none;
    font-size: 1rem;
    appearance: none;
    font-weight: 300;
    line-height: 2rem;
    border-radius: 2rem;
    padding: 0.5rem 1rem;
    background: var(--color-7);
    border: 1px solid rgba(0,0,0,0.2);
  }

  label.select:after {
    width: 2rem;
    opacity: 0.4;
    height: 2rem;
    content: '󰁊';
    font-size: 1.5rem;
    position: absolute;
    pointer-events: none;
    right: 1.5rem; top: 1.5rem;
  }

  label > input[type="checkbox"] {
    width: 2rem;
    height: 2rem;
    appearance: none;
    border-radius: 0;
  }

  label > input[type="checkbox"]:checked {
    border-color: var(--color-highlight-10);
    background-color: var(--color-highlight-10);
  }

  label > input[type="checkbox"]:checked:after {
    content: '󰸞';
    display: flex;
    font-size: 1.5rem;
    align-items: center;
    justify-content: center;
    color: var(--color-light);
    width: 100%; height: 100%;
  }

  .devices button {
    outline: none;
    margin: 0.5rem;
    padding: 1rem 2rem;
    background: var(--color-light);
    border-radius: var(--value-radius);
    border: 1px solid rgba(0,0,0,0.2);
  }

  .device {
    display: flex;
  }

  .device label {
    grid-template-columns: 10rem auto;
  }

  .device label.spot {
    grid-template-columns: 6rem 6rem;
  }
  
  button:focus {
    box-shadow: var(--value-box-shadow);
    text-shadow: var(--value-font-shadow);
  }

  label > input::placeholder { opacity: 0.5; }
  label.port > input { max-width: 10rem; text-align: center; }
  label > input:focus, label > select:focus { border-color: var(--color-highlight-10); }
</style>