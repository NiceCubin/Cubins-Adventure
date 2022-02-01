const dedent = require('dedent-js');

const Command = require('../../structures/Command');

module.exports = new Command({
  triggers: ['help', '?'],
  description: 'shows help for commands.',
  cooldown: 5,
  usage: ['[command | category]'],
  permissions: [],
  devOnly: false,
  async run(message, args, command, client) {
    const helpName = args[0];
    
    if (helpName === undefined) {
      const embed = {
        title: `${client.user.username} Command Help`,
        description: `\`${client.prefix}${command.name} [category]\``,
        fields: [],
        color: 0xff00ff
      }
        
      const categories = Array.from(client.categories.values());
        
      categories.sort((a, b) => a.name.localeCompare(b.name));
      
      for (const cat of categories) {
        const isDev = client.devs.includes(message.author.id);
    
        if (cat.hidden && !isDev) continue;
        
        embed.fields = embed.fields.concat({
          name: `${client.emojis.cache.get(cat.emojiID)} ${cat.name}`,
          value: cat.description
        });
      }
      
      return await message.reply({ embeds: [embed] });
    }
    
    for (const cat of client.categories) {
      const isDev = client.devs.includes(message.author.id);
      const isCategory = cat.name.toLowerCase() === helpName.toLowerCase();
      
      if (
        (cat.hidden && !isDev) ||
        !isCategory
      ) continue;
      
      return await message.reply({
        embeds: [
          {
            title: `${client.emojis.cache.get(cat.emojiID)} ${cat.name} Commands`,
            description: `${cat.commands.length ? `${`\`${cat.commands.map(cmd => cmd.name).sort((a, b) => a.localeCompare(b)).join(', ')}`}\`` : 'This Category has no commands.'}`,
            footer: { text: `use '${client.prefix}${command.name} [command]' for command info` },
            color: 0xff00ff
          }
        ]
      });
    }
    
    for (const cmd of client.commands) {
      const isDev = client.devs.includes(message.author.id);
      const isCommand = cmd.triggers.map(trig => trig.toLowerCase()).includes(helpName.toLowerCase());
      
      if (
        (cmd.devOnly && !isDev) ||
        !isCommand
      ) continue;
      
      return await message.reply({
        embeds: [
          {
            title: `Command: \`${client.prefix}${cmd.name}\``,
            description: dedent
              `**Description:** ${cmd.description}
              **Aliases:** \`${cmd.triggers.join(', ')}\`
              **Cooldown:** ${cmd.cooldown === 0 ? 'none' : cmd.cooldown}${cmd.cooldown === 0 ? '' : ` Second${cmd.cooldown === 1 ? '' : 's'}`}
              ${cmd.permissions.length === 0 ? '' : `**Permissions Required:** \`${cmd.permissions.map(perm => client.utils.getCamelCase(perm))}\``}`,
            author: { name: cmd.category.name, icon_url: client.utils.getEmojiIcon(client.emojis.cache.get(cmd.category.emojiID))},
            footer: { text: 'usage syntax: <required> [optional]' },
            fields: [
              { name: 'Usage:', value: `\`${client.prefix}${[cmd.name].concat(cmd.usage).join(' ')}\`` }
            ],
            color: 0xff00ff
          }
        ]
      });
    }

    return await message.reply({ embeds: [client.utils.embeds.invalid(`No Command or Category named \`${helpName}\` found.`)] });
  }
});