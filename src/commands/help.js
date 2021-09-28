const Command = require("../structures/Command");
const embeds = require("../utils/embeds")

module.exports = new Command({
  name: "help",
  description: "Shows help on commands!",
  async run(message, args, client) {
    await message.channel.send({embeds: [embeds.invalid("temporary answer")]});
  }
});