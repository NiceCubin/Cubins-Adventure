const Command = require('../../structures/Command');

module.exports = new Command({
  triggers: ['say', 'echo', 'repeat'],
  description: 'tell me what to say to repeat after you.',
  devOnly: true,
  async run(message, args, command, client) {
    const sayMessage = message.toString().substring((client.prefix + command.name).length + 1);

    await message.delete();
    await message.channel.send(sayMessage);
  }
});