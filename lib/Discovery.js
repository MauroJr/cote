const Discover = require('node-discover');

require('colors');

module.exports = Discovery;

const defaultOptions = {
  helloInterval: 2000,
  checkInterval: 4000,
  nodeTimeout: 5000,
  masterTimeout: 6000,
  monitor: false,
  log: true,
  helloLogsEnabled: true,
  statusLogsEnabled: true,
  ignoreProcess: false
};

function Discovery(advertisement, discoveryOptions = {}) {
  const options = {};

  Object.assign(options, defaultOptions, discoveryOptions);
  Object.assign(advertisement, { type: 'service' });

  const d = new Discover(options);

  d.me.processId = d.broadcast.processUuid;
  d.me.processCommand = process.argv.slice(1).map(n => n.split('/').slice(-2).join('/')).join(' ');

  d.advertise(advertisement);

  if (options.log) log(helloLogger(d));

  d.on('added', (obj) => {
    if (!options.monitor && obj.advertisement.key !== advertisement.key) return;
    if (options.log && options.helloLogsEnabled) log(statusLogger(obj, 'online'));
  });

  d.on('removed', (obj) => {
    if (!options.monitor && obj.advertisement.key !== advertisement.key) return;
    if (options.log && options.statusLogsEnabled) log(statusLogger(obj, 'offline'));
  });

  return d;
}

Discovery.setDefaults = options => Object.assign(defaultOptions, options);

function helloLogger(d) {
  const adv = d.me;
  let log = [];

  d.me.id = d.broadcast.instanceUuid;

  log.push('\nHello! I\'m'.white);
  log = log.concat(statusLogger(adv));
  log.push('\n========================\n'.white);

  return log;
}

function statusLogger(obj, config) {
  const adv = obj.advertisement;
  const log = [];
  let status;

  switch (config) {
    case 'online':
      status = '.online'.green;
      break;
    case 'offline':
      status = '.offline'.red;
      break;
    // no default
  }

  if (status) log.push(adv.type.magenta + status);

  log.push(adv.name.white + '#'.grey + obj.id.grey);

  if (adv.port) log.push('on', adv.port.toString().blue);

  return log;
}

function log(log) {
  console.log.apply(console.log, log);
}
