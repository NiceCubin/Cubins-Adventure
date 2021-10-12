const Command = require('../../structures/Command');
const embeds = require('../../utils/embeds');

module.exports = new Command({
  triggers: ['say', 'echo', 'repeat'],
  description: 'tell me what to say to repeat after you.',
  cooldown: 0,
  usage: '<message>',
  permissions: [],
  devOnly: true,
  async run(message, args, command, client) {
    if (args.length === 0) {
      return await message.reply({ embeds: [embeds.invalid('You must input a message for me to say.')] });
    }
    
    const sayMessage = message.toString().substring((client.prefix + command.name).length + 1);

    await message.delete();
    await message.channel.send(sayMessage);
  }
});