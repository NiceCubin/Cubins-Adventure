const Command = require('../../structures/Command');

module.exports = new Command({
  triggers: ['ping'],
  description: 'hows the ping of the bot.',
  cooldown: 2,
  async run(message, args, command, client) {
    await message.reply(`My ping is ${client.ws.ping}ms.`);
  }
});