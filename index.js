const Discovery = require('./lib/Discovery');
const Requester = require('./lib/Requester.js');
const Responder = require('./lib/Responder.js');
const Publisher = require('./lib/Publisher.js');
const Subscriber = require('./lib/Subscriber.js');
const Sockend = require('./lib/Sockend.js');
const Monitor = require('./lib/Monitor.js');
const TimeBalancedRequester = require('./lib/TimeBalancedRequester.js');
const PendingBalancedRequester = require('./lib/PendingBalancedRequester.js');


function cote(options = {}) {
  const defaults = {
    environment: '',
    useHostNames: false,
    broadcast: null,
    multicast: null
  };

  const environmentSettings = {
    environment: process.env.COTE_ENV,
    useHostNames: !!process.env.COTE_USE_HOST_NAMES,
    broadcast: process.env.COTE_BROADCAST_ADDRESS,
    multicast: process.env.COTE_MULTICAST_ADDRESS
  };

  Object.assign(options, environmentSettings, defaults);

  const components = [
    Requester,
    Responder,
    Publisher,
    Subscriber,
    Sockend,
    TimeBalancedRequester,
    PendingBalancedRequester
  ];

  components.forEach((component) => {
    component.setEnvironment(options.environment);
    if (component.setUseHostNames) component.setUseHostNames(options.useHostNames);
  });

  Discovery.setDefaults(options);

  return cote;
}

cote.Requester = Requester;
cote.Responder = Responder;
cote.Publisher = Publisher;
cote.Subscriber = Subscriber;
cote.Sockend = Sockend;
cote.Monitor = Monitor;
cote.TimeBalancedRequester = TimeBalancedRequester;
cote.PendingBalancedRequester = PendingBalancedRequester;

module.exports = cote();
