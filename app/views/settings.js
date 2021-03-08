import Settings from '../components/Settings.svelte';

const settings = new Settings({
  target: document.body,
  props: { showSecret: true }
});

export default settings;