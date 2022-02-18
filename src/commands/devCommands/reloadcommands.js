const Command = require('../../structures/Command');

module.exports = new Command({
  filename: __filename,
  triggers: ['reloadcommands', 'reloadcmds'],
  description: 'reloads all commands and their respective categories.',
  cooldown: 0,
  usage: [],
  permissions: [],
  devOnly: true,
  async run(message, args, command, client, Discord) {
    client.unloadCommands();
    client.loadCommands();
    
    return await message.reply('Successfully reloaded all commands and their respective categories.');
  }
});