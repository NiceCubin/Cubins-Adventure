const Command = require('../../structures/Command');

module.exports = new Command({
  triggers: ['reloadassets'],
  description: 'reloads all assets.',
  cooldown: 0,
  usage: [],
  permissions: [],
  devOnly: true,
  async run(message, args, command, client, Discord) {
    client.unloadAssets();
    client.loadAssets();

    return await message.reply('Successfully reloaded all assets.');
    }
});