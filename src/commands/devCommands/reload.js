const Command = require('../../structures/Command');
const embeds = require('../../utils/embeds');

module.exports = new Command({
  triggers: ['reload'],
  description: 'reloads a command.',
  cooldown: 0,
  usage: '<command>',
  permissions: [],
  devOnly: true,
  async run(message, args, command, client) {
    let commandName = args[0];
    
    if (!commandName) {
      return await message.reply({ embeds: [embeds.invalid('You must input a command to reload.')] });
    }

    for (const [, cmd] of client.commands) {
      hasCommand = cmd.triggers.map(trig => trig.toLowerCase()).includes(commandName.toLowerCase());

      if (!hasCommand) continue;
      
      delete require.cache[require.resolve(`../../commands/infoCommands/help`)];
      client.commands.delete(cmd.name);
      client.commands.set(cmd.name, cmd);
      
      return await message.reply(`Successfully Reloaded \`${cmd.name}\`.`);
    }
    
    return await message.reply({ embeds: [embeds.invalid(`No Command named \`${commandName}\` found.`)] });
  }
});