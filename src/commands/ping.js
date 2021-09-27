const Command = require("../structures/Command.js");
module.exports = new Command({
  name: "ping",
  description: "Shows the ping of the bot!",
  permissions: ["SEND_MESSAGES"],
  async run(message, args, client) {
    await message.reply(`My ping is ${client.ws.ping}ms!`);
  }
});