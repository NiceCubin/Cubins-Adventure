const Command = require('../../structures/Command');

module.exports = new Command({
  triggers: ['reloadevents'],
  description: 'reloads all events.',
  cooldown: 0,
  usage: [],
  permissions: [],
  devOnly: true,
  async run(message, args, command, client, Discord) {
    client.unloadEvents();
    client.loadEvents();
    
    return await message.reply('Successfully reloaded all events.');
    }
});