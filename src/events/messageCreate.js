const Event = require('../structures/Event');
const embeds = require('../utils/embeds');

module.exports = new Event({
  event: 'messageCreate',
  run(client, message) {
    if (
      !message.content.startsWith(client.prefix) ||
      message.author.bot ||
      !message.guild
    ) return;
    
    const args = message.content.substring(client.prefix.length).split(/\s+/g);
    
    const commandName = args.shift()
    const command = client.commands.find(cmd => cmd.triggers.map(trig => trig.toLowerCase()).includes(commandName.toLowerCase()));

    if (command == null) return;
    
    const has_permissions = message.member.permissions.has(command.permissions);

    if (!has_permissions) {
      return message.reply({ embeds: [embeds.invalid('You do not have the permissions required to use this command.')] });
  }

    command.run(message, args, command, client);
  }
});