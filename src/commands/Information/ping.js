const Command = require("../../structures/Command");

module.exports = new Command({
  name: "ping",
  description: "shows the ping of the bot.",
  async run(message, args, client) {
    await message.reply(`My ping is ${client.ws.ping}ms.`);
  }
});