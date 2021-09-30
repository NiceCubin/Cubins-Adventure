const Event = require("../structures/Event");

module.exports = new Event("messageCreate", (client, message) => {
  if (!message.content.startsWith(client.prefix) || message.channel === message.author) return;

  const args = message.content.substring(client.prefix.length).split(/ +/);
  const command = client.commands.find(cmd => cmd.name.toLowerCase() === args[0].toLowerCase());

  if (command == null) return;

  const has_permissions = message.member.permissions.has(command.permission);

  if (!has_permissions) {
    return message.reply("You don't have the permissions required to use this command!");
  }

  command.run(message, args, client);
});