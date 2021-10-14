const Command = require('../../structures/Command');
const embeds = require('../../utils/embeds');

module.exports = new Command({
  triggers: ['eval', 'evaluate'],
  description: 'evaluates inputted code.',
  cooldown: 0,
  usage: '<code>',
  permissions: [],
  devOnly: true,
  async run(message, args, command, client) {
    const spaceIndex = message.content.toString().indexOf(' ');
    const code = message.content.toString().substring(spaceIndex + 1);

    try {
      var evaluation = eval(code).toString();
    } catch(err) {
      return await message.reply({ embeds: [embeds.error(err.toString())] });
    }
    
    await message.reply(`\`\`\`\n${evaluation}\`\`\``);
  }
});