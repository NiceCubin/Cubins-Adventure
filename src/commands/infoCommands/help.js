const dedent = require('dedent-js');

const Command = require('../../structures/Command');
const embeds = require('../../utils/embeds');
const { getCamelCase, getEmojiIcon } = require('../../utils/default');

module.exports = new Command({
  triggers: ['help', '?'],
  description: 'shows help for commands.',
  cooldown: 5,
  usage: '[command | category]',
  async run(message, args, client) {
    const helpName = args[1];
    
    if (helpName == null) {
      const embed = {
        title: 'Cubin\'s Adventure Command Help',
        description: `\`${client.prefix}${require(__filename).name} [category]\``,
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

    
    for (const cat in client.categories.values()) {
      if (cat.name.toLowerCase() === helpName.toLowerCase()) {
        const category = cat;
      
        return await message.reply({ embeds: [
          {
            title: `${client.emojis.cache.get(category.emojiID)} ${category.name} Commands`,
            description: `\`${category.commands.map(cmd => cmd.name).join(', ')}\``,
            color: 0xff00ff,
            footer: { text: `use '${client.prefix}${require(__filename).name} [command]' for command info` }
          }
        ] });
      }
    }
    
    for (const cmd of client.commands.values()) {
      if (cmd.triggers.map(cmd => 
      cmd.toLowerCase()).includes(helpName[0].toLowerCase())) {
        const command = cmd;
      
        return await message.reply({ embeds: [
          {
            title: `Command: \`${client.prefix}${command.name}\``,
            description: dedent
                         `**Description:** ${command.description}
                         **Aliases:** \`${command.triggers.join(', ')}\`
                         **Cooldown:** ${command.cooldown === 0 ? 'none' : command.cooldown}${command.cooldown === 0 ? '' : ` Second${command.cooldown === 1 ? '' : 's'}`}
                         ${command.permissions.length === 0 ? '' : `**Permissions Needed:** \`${command.permissions.map(perm => getCamelCase(perm.replaceAll('_', ' ')))}\``}`,
            color: 0xff00ff,
            fields: [
              { name: 'Usage:', value: `\`${client.prefix}${command.name}${command.usage != null ? ` ${command.usage}` : ''}\`` }
            ],
            author: { name: command.category.name, icon_url: getEmojiIcon(client.emojis.cache.get(command.category.emojiID))},
            footer: { text: 'usage syntax: <required> [optional]' }
          }
        ] });
      }
    }

    return await message.reply({ embeds: [embeds.invalid(`No Command or Command Category named \`${helpName}\`.`)] });
  }
});