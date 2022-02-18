const Command = require('../../structures/Command');

module.exports = new Command({
  filename: __filename,
  triggers: ['loadcommand', 'loadcmd'],
  description: 'loads a singular command.',
  cooldown: 0,
  usage: ['<command>'],
  permissions: [],
  devOnly: true,
  async run(message, args, command, client, Discord) {
    const commandName = args[0];
    
    if (!commandName) {
      return await message.reply({ embeds: [client.utils.embeds.invalid('You must input a command.')] });
    }

    const loadedCommand = client.getCommand(commandName);
    
    if (loadedCommand) {
      return await message.reply({ embeds: [client.utils.embeds.invalid(`Command named \`${loadedCommand.name}\` is already loaded.`)] });
    }

    const disabledCommand = client.getDisabledCommand(commandName);

    if (!disabledCommand) {
      return await message.reply({ embeds: [client.utils.embeds.invalid(`No command named \`${commandName}\` found.`)] });
    }
    
    client.loadCommand(commandName);
    
    return await message.reply(`Successfully loaded \`${disabledCommand.name}\`.`);
  }
});