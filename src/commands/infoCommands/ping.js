const Command = require('../../structures/Command');

module.exports = new Command({
  triggers: ['ping'],
  description: 'shows the ping of the bot.',
  cooldown: 2,
  usage: '',
  permissions: [],
  devOnly: false,
  async run(message, args, command, client) {
    return await message.reply(`My ping is ${client.ws.ping}ms.`);
  }
});