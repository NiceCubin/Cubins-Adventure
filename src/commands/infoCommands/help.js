const dedent = require('dedent-js');

const Command = require('../../structures/Command');

module.exports = new Command({
  filename: __filename,
  triggers: ['help', '?'],
  description: 'shows help for commands.',
  cooldown: 5,
  usage: ['[command | category]'],
  permissions: [],
  devOnly: false,
  async run(message, args, command, client, Discord) {
    const helpName = args[0];
    
    if (!helpName) {
      const embed = {
        title: `${client.user.username} Command Help`,
        description: `\`${client.prefix}${command.name} [category]\``,
        fields: [],
        color: 0xff00ff
      }
      
      const sortedCategories = Array.from(client.categories.values()).sort((a, b) => a.name.localeCompare(b.name));
      
      for (const cat of sortedCategories) {
        if (cat.hidden && !client.isDev(message.author.id)) continue;
        
        embed.fields = embed.fields.concat({
          name: `${client.emojis.cache.get(cat.emojiID)} ${cat.name}`,
          value: cat.description
        });
      }
      
      return await message.reply({ embeds: [embed] });
    }
    
    const helpCategory = client.getCategory(helpName);
    const isHidden = (helpCategory?.hidden && !client.isDev(message.author.id));
    
    if (helpCategory && !isHidden) {
      return await message.reply({
        embeds: [
          {
            title: `${client.emojis.cache.get(helpCategory.emojiID)} ${helpCategory.name} Commands`,
            description: `${helpCategory.commands.size ? `${`\`${Array.from(helpCategory.commands.values()).map(cmd => cmd.name).sort((a, b) => a.localeCompare(b)).join(', ')}`}\`` : 'This Category has no commands.'}`,
            footer: { text: `use '${client.prefix}${command.name} [command]' for command info` },
            color: 0xff00ff
          }
        ]
      });
    }
    
    const helpCommand = client.getCommand(helpName);
    const hasNoDevAccess = (helpCommand?.devOnly && !client.isDev(message.author.id));
    
    if (helpCommand && !hasNoDevAccess) {
      return await message.reply({
        embeds: [
          {
            title: `Command: \`${client.prefix}${helpCommand.name}\``,
            description: dedent
              `**Description:** ${helpCommand.description}
              **Aliases:** \`${helpCommand.triggers.join(', ')}\`
              **Cooldown:** ${helpCommand.cooldown ? helpCommand.cooldown : 'none'}${helpCommand.cooldown ? ` Second${helpCommand.cooldown === 1 ? '' : 's'}` : ''}
              ${helpCommand.permissions.length ? `**Permissions Required:** \`${helpCommand.permissions.map(perm => client.utils.getCamelCase(perm))}\`` : ''}`,
            author: { name: helpCommand.category.name, icon_url: client.utils.getEmojiIcon(client.emojis.cache.get(helpCommand.category.emojiID))},
            footer: { text: 'usage syntax: <required>, [optional], *multiple' },
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