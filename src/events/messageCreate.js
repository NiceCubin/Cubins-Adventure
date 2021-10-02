const Event = require("../structures/Event");
const embeds = require("../utils/embeds")

module.exports = new Event({
  event: "messageCreate",
  run(client, message) {
    if (!message.content.startsWith(client.prefix) || message.author.bot || message.channel === message.author) return;
    
    const args = message.content.substring(client.prefix.length).split(/\s+/g);
    
    const checkCommand = client.commands.find(cmd => cmd.name.toLowerCase() === args[0].toLowerCase());
    const checkAlias = client.commands.find(cmd => cmd.triggers.map(trig => trig.toLowerCase() === args[0].toLowerCase()));

    const command = checkCommand ?? checkAlias;

    if (command == null) return;

    const has_permissions = message.member.permissions.has(command.permissions);

    if (!has_permissions) {
      return message.reply({ embeds: [embeds.invalid("You don't have the permissions required to use this command.")] });
  }

    command.run(message, args, client);
  }
});