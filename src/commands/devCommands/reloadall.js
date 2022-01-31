const Command = require('../../structures/Command');

module.exports = new Command({
  triggers: ['reloadall'],
  description: 'reloads all commands, events, utils, and assets',
  cooldown: 0,
  usage: [],
  permissions: [],
  devOnly: true,
  async run(message, args, command, client) { 
    client.unloadCommands();
    client.loadCommands();

    client.unloadEvents();
    client.loadEvents();

    client.unloadUtils();
    client.loadUtils();

    client.unloadAssets();
    client.loadAssets();

    return await message.reply('Successfully reloaded everything.');
  }
});