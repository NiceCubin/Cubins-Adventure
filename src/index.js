const Discord = require("discord.js");
const keepAlive = require("../server");
const config = require("../config.json");

const client = new Discord.Client({
  intents: config.intents,
  presence: config.presence,
  allowedMentions: config.allowedMentions
});

client.on("ready", () => {
  console.log(`Ready: ${client.user.tag} | Servers: ${client.guilds.cache.size}`);
})

keepAlive();
client.login(process.env.TOKEN);