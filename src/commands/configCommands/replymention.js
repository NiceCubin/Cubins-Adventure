const fs = require('fs');

const Command = require('../../structures/Command');
const embeds = require('../../utils/embeds');
const mentions = require('../../database/replymentions.json');

module.exports = new Command({
  triggers: ['replymention', 'replyping'],
  description: 'toggles whether to mention you in a reply.',
  cooldown: 0,
  usage: '[boolean]',
  permissions: [],
  devOnly: false,
  async run(message, args, command, client) {
    const boolean = args[0]?.toLowerCase();

    if (boolean == null) {
      if (mentions[message.author.id] == null) {
        mentions[message.author.id] = false;
      }
    }

    switch (boolean) {
      case "true":
        mentions[message.author.id] = true;
        await message.reply('set to true');
        break;
        
      case "false":
        mentions[message.author.id] = false;
        await message.reply('set to false');
        break;

      case null:
      case undefined:
        await message.reply(`currently ${mentions[message.author.id]}`);
        break;
        
      default:
        await message.reply({ embeds: [embeds.invalid('You must input a boolean!')] });
    }
    
    fs.writeFileSync('./src/database/replymentions.json', JSON.stringify(mentions, null, 4));
    
  }
});