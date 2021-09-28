const Command = require("../structures/Command");

module.exports = new Command({
  name: "ping",
  description: "Shows the ping of the bot!",
  async run(message, args, client) {
    await message.reply(`My ping is ${client.ws.ping}ms!`);
  }
});