const fs = require('fs');

const Command = require('../../structures/Command');
const embeds = require('../../utils/embeds');

module.exports = new Command({
  triggers: ['reloadall'],
  description: 'reloads all commands.',
  cooldown: 0,
  usage: '<command>',
  permissions: [],
  devOnly: true,
  async run(message, args, command, client) {
    client.commands.clear();
    fs.readdirSync('./src/commands').forEach(cat => {
      fs.readdirSync(`./src/commands/${cat}`).forEach(cmd => {
        delete require.cache[require.resolve(`../../commands/${cat}/${cmd}`)];
        
        command = require(`../../commands/${cat}/${cmd}`);
        client.commands.set(cmd.name, cmd);
      });
    });
    
    return await message.reply('Successfully reloaded all commands.');
    }
});