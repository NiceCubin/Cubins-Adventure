console.clear();

const keepAlive = require("../server.js");
const config = require("../config.json");
const Client = require("./structures/Client.js");

const client = new Client({
  prefix: config.prefix,
  intents: config.intents,
  allowedMentions: config.allowedMentions,
  presence: config.presence
});

keepAlive();
client.start(process.env.TOKEN);