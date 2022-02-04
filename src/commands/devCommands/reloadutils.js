const Command = require('../../structures/Command');

module.exports = new Command({
  triggers: ['reloadutils'],
  description: 'reloads all utils.',
  cooldown: 0,
  usage: [],
  permissions: [],
  devOnly: true,
  async run(message, args, command, client, Discord) {
    client.unloadUtils();
    client.loadUtils();
    
    return await message.reply('Successfully reloaded all utils.');
  }
});