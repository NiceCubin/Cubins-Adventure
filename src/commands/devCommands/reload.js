const fs = require('fs');

const Command = require('../../structures/Command');
const embeds = require('../../utils/embeds');

module.exports = new Command({
  triggers: ['reload'],
  description: 'reloads all commands.',
  cooldown: 0,
  usage: ['<command>'],
  permissions: [],
  devOnly: true,
  async run(message, args, command, client) {
    client.unloadCommands();
    client.loadCommands();

    return await message.reply('Successfully reloaded all commands.');
    }
});