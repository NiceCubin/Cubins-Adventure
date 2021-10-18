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

    if (boolean == null && mentions[message.author.id] == null) {
      mentions[message.author.id] = false;
    }

    let content
    switch (boolean) {
      case "true":
        mentions[message.author.id] = true;
        content = 'set to true';
        break;
        
      case "false":
        mentions[message.author.id] = false;
        content = 'set to false';
        break;

      case null:
      case undefined:
        content = `currently ${mentions[message.author.id]}`;
        break;
        
      default:
        content = { embeds: [embeds.invalid('You must input a boolean!')] }
    }
    
    fs.writeFileSync('./src/database/replymentions.json', JSON.stringify(mentions, null, 4));
    
    return await message.reply(content);
    
  }
});