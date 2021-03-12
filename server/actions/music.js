const fetch = require('node-fetch');
const tokens = require('../lib/tokens');
const { musicApiURL } = require('../../config.proxy');

async function next () {
  const token = await tokens.music();
  const resp = await fetch(`${musicApiURL}/me/player/next`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  return resp.status === 200;
}

async function prev () {
  const token = await tokens.music();
  const resp = await fetch(`${musicApiURL}/me/player/previous`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  return resp.status === 200;
}

async function play () {
  const token = await tokens.music();
  const resp = await fetch(`${musicApiURL}/me/player/play`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  return resp.status === 200;
}

async function pause () {
  const token = await tokens.music();
  const resp = await fetch(`${musicApiURL}/me/player/pause`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  return resp.status === 200;
}

module.exports = { play, pause, prev, next };