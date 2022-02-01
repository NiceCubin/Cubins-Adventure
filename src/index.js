const keepAlive = require('../server');
const config = require('../config.json');
const package = require('../package.json');

const Client = require('./structures/Client');

const client = new Client({
  package: package,
  prefix: config.prefix,
  devs: config.devs,
  intents: config.intents,
  allowedMentions: config.allowedMentions,
  presence: config.presence
});

keepAlive();
client.start(process.env.TOKEN);