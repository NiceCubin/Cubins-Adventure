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
  async run(message, args, thisCommand, client, Discord) {
    const name = args[0];
    
    if (!name) {
      const embed = {
        title: `${client.user.username} Command Help`,
        description: `\`${client.prefix}${thisCommand.name} [category]\``,
        fields: [],
        color: 0xFF00FF
      }
      
      const sortedCategories = Array.from(client.categories.values()).sort((a, b) => a.name.localeCompare(b.name));
      
      for (const cat of sortedCategories) {
        if (cat.hidden && !client.isDev(message.author.id)) continue;
        
        embed.fields = embed.fields.concat({
          name: `${client.emojis.cache.get(cat.emojiID)} ${cat.name}`,
          value: cat.description
        });
      }
      
      return await message.reply({
        embeds: [
          embed
        ]
      });
    }
    
    const category = client.getCategory(name);
    const isHidden = (category?.hidden && !client.isDev(message.author.id));
    
    if (category && !isHidden) {
      return await message.reply({
        embeds: [
          {
            title: `${client.emojis.cache.get(category.emojiID)} ${category.name}`,
            description: dedent          
              `**Description:** ${category.description}
              **Aliases:** \`${category.triggers.join(', ')}\``,
            fields: [
              { name: 'Commands:', value: `\`${category.commands.size ? Array.from(category.commands.values()).map(cmd => cmd.name).sort((a, b) => a.localeCompare(b)).join(', ') : 'This Category has no commands.'}\`` }
            ],
            footer: { text: `use '${client.prefix}${thisCommand.name} [command]' for command info` },
            color: 0xFF00FF
          }
        ]
      });
    }
    
    const command = client.getCommand(name);
    const hasNoDevAccess = (command?.devOnly && !client.isDev(message.author.id));
    
    if (command && !hasNoDevAccess) {
      return await message.reply({
        embeds: [
          {
            author: { name: command.category.name, icon_url: client.getEmojiIcon(client.emojis.cache.get(command.category.emojiID))},
            title: `Command: \`${client.prefix}${command.name}\``,
            description: dedent
              `**Description:** ${command.description}
              **Aliases:** \`${command.triggers.join(', ')}\`
              **Cooldown:** ${command.cooldown ? command.cooldown : 'none'}${command.cooldown ? ` Second${command.cooldown === 1 ? '' : 's'}` : ''}
              ${command.permissions.length ? `**Permissions Required:** \`${command.permissions.map(perm => client.toCamelCase(perm))}\`` : ''}`,
            fields: [
              { name: 'Usage:', value: `\`${client.prefix}${[command.name].concat(command.usage).join(' ')}\`` }
            ],
            footer: { text: 'usage syntax: <required>, [optional], ...multiple' },
            color: 0xFF00FF
          }
        ]
      });
    }
    
    return await message.reply({
      embeds: [
  client.embeds.invalid(`No Command or Category named \`${name}\` found.`)
      ]
    });
  }
});