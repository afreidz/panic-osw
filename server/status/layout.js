const logger = require('../../lib/logger');

const id = 'layout';
const layoutCommands = ['splith', 'splitv', 'mode "resize"', 'mode "default"', 'mode "launch"'];

let layoutCache = 'splith';
module.exports = async function (data) {
  const { binding } = await Promise.resolve(JSON.parse(data.toString())).catch(logger.error);
  if (binding.command && layoutCommands.some(c => binding.command.includes(c))) {
    let layout = binding.command;

    if (layout.includes('splith')) {
      layoutCache = 'splith';
    } else if (layout.includes('splitv')) {
      layoutCache = 'splitv';
    }

    if (layout.includes('mode "default"')) {
      layout = layoutCache;
    }

    if (layout.includes('mode "resize"')) {
      layout = 'resize';
    }

    if (layout.includes('mode "launch"')) {
      layout = 'launch';
    }

    return { id, layout };
  }
}
