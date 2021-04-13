const fetch = require('node-fetch');
const codeToIcon = require('../lib/weather');
const config = require('../../config.proxy');

const cache = [];
const time = "5m";
const units = 'imperial';
const fields = ['temperature', 'weatherCode'];

async function weather() {
  const now = new Date();

  const current = cache.find(r => {
    const date = new Date(r.date);
    return now <= date;
  });

  if (!!current) return current;
  if (!current) cache.splice(0, cache.length);

  const url = new URL(config.weather.api);
  url.searchParams.append('units', units);
  url.searchParams.append('fields', fields);
  url.searchParams.append('apikey', config.weather.key);
  url.searchParams.append('location', config.weather.location);

  const { data } = await (await fetch(url)).json();

  console.log('API Result', data);

  data.timelines[0].intervals.forEach(r => {
    const code = r.values.weatherCode;
    const temp = Math.round(r.values.temperature);
    const { icon, text } = codeToIcon(r.values.weatherCode);

    cache.push({
      id: 'weather',
      date: r.startTime,
      weather: { icon, text, temp, code }
    });
  });

  return cache[0];
}

module.exports = weather;

(async () => {
  console.log(await weather());
  await new Promise(r => setTimeout(r, 5000));
  console.log(await weather());
})();
