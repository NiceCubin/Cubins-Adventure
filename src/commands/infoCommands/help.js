const dedent = require('dedent-js');

const Command = require('../../structures/Command');
const embeds = require('../../utils/embeds');
const { getCamelCase, getEmojiIcon } = require('../../utils/default');

module.exports = new Command({
  triggers: ['help', '?'],
  description: 'shows help for commands.',
  cooldown: 5,
  usage: '[command | category]',
  async run(message, args, command, client) {
    const helpName = args[0];
    
    if (helpName == null) {
      const embed = {
        title: 'Cubin\'s Adventure Command Help',
        description: `\`${client.prefix}${command.name} [category]\``,
        color: 0xff00ff,
        fields: []
      }
      
        client.categories.forEach(category => {
        embed.fields = embed.fields.concat({
          name: `${client.emojis.cache.get(category.emojiID)} ${category.name}`,
          value: category.description,
          inline: false
        });
      });
      
      return await message.reply({ embeds: [embed] });
    }
    
    for (const cat of client.categories.values()) {
      const isCategory = cat.name.toLowerCase() === helpName.toLowerCase();
      
      if (isCategory) {   
        return await message.reply({ embeds: [
          {
            title: `${client.emojis.cache.get(cat.emojiID)} ${cat.name} Commands`,
            description: `\`${cat.commands.map(cmd => cmd.name).join(', ')}\``,
            color: 0xff00ff,
            footer: { text: `use '${client.prefix}${command.name} [command]' for command info` }
          }
        ] });
      }
    }
    
    for (const cmd of client.commands.values()) {
      const hasCommand = cmd.triggers.map(cmd => cmd.toLowerCase()).includes(helpName.toLowerCase());
      
      if (hasCommand) {
        return await message.reply({ embeds: [
          {
            title: `Command: \`${client.prefix}${cmd.name}\``,
            description: dedent
              `**Description:** ${cmd.description}
              **Aliases:** \`${cmd.triggers.join(', ')}\`
              **Cooldown:** ${cmd.cooldown === 0 ? 'none' : cmd.cooldown}${cmd.cooldown === 0 ? '' : ` Second${cmd.cooldown === 1 ? '' : 's'}`}
              ${cmd.permissions.length === 0 ? '' : `**Permissions Needed:** \`${cmd.permissions.map(perm => getCamelCase(perm.replaceAll('_', ' ')))}\``}`,
            color: 0xff00ff,
            fields: [
              { name: 'Usage:', value: `\`${client.prefix}${cmd.name}${cmd.usage == null ? '' : ` ${cmd.usage}`}\`` }
            ],
            author: { name: cmd.category.name, icon_url: getEmojiIcon(client.emojis.cache.get(cmd.category.emojiID))},
            footer: { text: 'usage syntax: <required> [optional]' }
          }
        ] });
      }
    }

    return await message.reply({ embeds: [embeds.invalid(`No Command or Command Category named \`${helpName}\`.`)] });
  }
});
