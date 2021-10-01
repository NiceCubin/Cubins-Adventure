const Event = require("../structures/Event");
const embeds = require("../utils/embeds")

module.exports = new Event({
  event: "messageCreate",
  run(client, message) {
    if (!message.content.startsWith(client.prefix) || message.author.bot || message.channel === message.author) return;
    
    const args = message.content.substring(client.prefix.length).split(/\s+/);
    const command = client.commands.find(cmd => cmd.name.toLowerCase() === args[0].toLowerCase());

    if (command == null) return;

    const has_permissions = message.member.permissions.has(command.permissions);

    if (!has_permissions) {
      return message.reply({ embeds: [embeds.invalid("You don't have the permissions required to use this command.")] });
  }

    command.run(message, args, client);
  }
});