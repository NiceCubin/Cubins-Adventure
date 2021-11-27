const keepAlive = require('../server');
const config = require('../config.json');
const Client = require('./structures/Client');

const client = new Client({
  version: config.version,
  prefix: config.prefix,
  devs: config.devs,
  intents: config.intents,
  allowedMentions: config.allowedMentions,
  presence: config.presence,
});

keepAlive();
client.start(process.env.TOKEN);