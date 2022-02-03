const dedent = require('dedent-js');

const Command = require('../../structures/Command');

module.exports = new Command({
  triggers: ['help', '?'],
  description: 'shows help for commands.',
  cooldown: 5,
  usage: ['[command | category]'],
  permissions: [],
  devOnly: false,
  async run(message, args, command, client, Discord) {
    const helpName = args[0];
    
    if (helpName === undefined) {
      const embed = {
        title: `${client.user.username} Command Help`,
        description: `\`${client.prefix}${command.name} [category]\``,
        fields: [],
        color: 0xff00ff
      }
        
      const categories = Array.from(client.categories.values()).sort((a, b) => a.name.localeCompare(b.name));
      
      for (const cat of categories) {
        if (cat.hidden && !client.isDev(message.author.id)) continue;
        
        embed.fields = embed.fields.concat({
          name: `${client.emojis.cache.get(cat.emojiID)} ${cat.name}`,
          value: cat.description
        });
      }
      
      return await message.reply({ embeds: [embed] });
    }
    
    const helpCategory = client.getCategory(helpName);
    const notHidden = helpCategory?.hidden && client.isDev(message.author.id);

    if (helpCategory != null && notHidden) {
      return await message.reply({
        embeds: [
          {
            title: `${client.emojis.cache.get(helpCategory.emojiID)} ${helpCategory.name} Commands`,
            description: `${helpCategory.commands.length ? `${`\`${helpCategory.commands.map(cmd => cmd.name).sort((a, b) => a.localeCompare(b)).join(', ')}`}\`` : 'This Category has no commands.'}`,
            footer: { text: `use '${client.prefix}${command.name} [command]' for command info` },
            color: 0xff00ff
          }
        ]
      });
    }

    const helpCommand = client.getCommand(helpName);
    const hasDevAccess = helpCommand?.devOnly && client.isDev(message.author.id);

    
    if (helpCommand != null && hasDevAccess) {
      return await message.reply({
        embeds: [
          {
            title: `Command: \`${client.prefix}${helpCommand.name}\``,
            description: dedent
              `**Description:** ${helpCommand.description}
              **Aliases:** \`${helpCommand.triggers.join(', ')}\`
              **Cooldown:** ${helpCommand.cooldown === 0 ? 'none' : helpCommand.cooldown}${helpCommand.cooldown === 0 ? '' : ` Second${helpCommand.cooldown === 1 ? '' : 's'}`}
              ${helpCommand.permissions.length === 0 ? '' : `**Permissions Required:** \`${helpCommand.permissions.map(perm => client.utils.getCamelCase(perm))}\``}`,
            author: { name: helpCommand.category.name, icon_url: client.utils.getEmojiIcon(client.emojis.cache.get(helpCommand.category.emojiID))},
            footer: { text: 'usage syntax: <required> [optional]' },
            fields: [
              { name: 'Usage:', value: `\`${client.prefix}${[helpCommand.name].concat(helpCommand.usage).join(' ')}\`` }
            ],
            color: 0xff00ff
          }
        ]
      });
    }

    return await message.reply({ embeds: [client.utils.embeds.invalid(`No Command or Category named \`${helpName}\` found.`)] });
  }
});