const Command = require('../../structures/Command');

module.exports = new Command({
  triggers: ['reloadall'],
  description: 'reloads all commands, events, and utils.',
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

    return await message.reply('Successfully reloaded all commands, events, and utils.');
  }
});