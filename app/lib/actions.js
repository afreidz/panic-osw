const defaults = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
};

async function login(user, pass) {
  const resp = await fetch('/system/login', {
    ...defaults,
    body: JSON.stringify({ user, pass }),
  });
  if (resp.status !== 200) throw new Error('login unsuccessful');
  return resp;
}

async function toggle(device, spot) {
  const resp = await fetch('/devices/toggle', {
    ...defaults,
    body: JSON.stringify({ device, spot }),
  });
  const { status } = await resp.json();
  return status;
}

async function play() {
  const resp = await (await fetch('/music/play', {
    ...defaults,
  })).json();
  return resp;
}

async function pause() {
  const resp = await (await fetch('/music/pause', {
    ...defaults,
  })).json();
  return resp;
}

async function next() {
  const resp = await (await fetch('/music/next', {
    ...defaults,
  })).json();
  return resp;
}

async function prev() {
  const resp = await (await fetch('/music/prev', {
    ...defaults,
  })).json();
  return resp;
}

async function sleep() {
  const resp = await (await fetch('/system/sleep', {
    ...defaults,
  })).json();
  return resp;
}

async function shutdown() {
  const resp = await (await fetch('/system/shutdown', {
    ...defaults,
  })).json();
  return resp;
}

async function restart() {
  const resp = await (await fetch('/system/restart', {
    ...defaults,
  })).json();
  return resp;
}

async function logout() {
  const resp = await (await fetch('/system/logout', {
    ...defaults,
  })).json();
  return resp;
}

async function setVolume(vol) {
  const resp = await (await fetch('/system/volume', {
    ...defaults,
    body: JSON.stringify({ vol }),
  })).json();
  return resp;
}

async function speedtest() {
  const resp = await (await fetch('/network/speed', {
    ...defaults,
  })).json();
  return resp;
}

async function settings(settings) {
  const resp = await (await fetch('/system/settings', {
    ...defaults,
    body: JSON.stringify({ settings }),
  })).json();
  return resp;
}

async function setBrightness(brightness) {
  const resp = await (await fetch('/system/brightness', {
    ...defaults,
    body: JSON.stringify({ brightness })
  })).json();
  return resp;
}

async function activateWS(ws) {
  const resp = await (await fetch(`/workspace/activate/${ws}`, {
    ...defaults,
  })).json();
  return resp;
}

async function launch(app) {
	const resp = await fetch('/system/launch', {
    ...defaults,
    body: JSON.stringify({ app }),
  });
  if (resp.status !== 200) throw new Error('launch unsuccessful');
  return resp;
}

export const devices = { toggle };
export const network = { speedtest };
export const music = { play, pause, next, prev };
export const workspace = { activate: activateWS };
export const system = { 
	sleep, 
	login, 
	logout,
	launch,
	restart, 
	shutdown, 
	settings, 
	setVolume, 
	setBrightness, 
};