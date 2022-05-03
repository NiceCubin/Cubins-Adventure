const Discord = require('discord.js');

const Event = require('../structures/Event');

module.exports = new Event({
  filename: __filename,
  event: 'messageCreate',
  async run(client, message) {
    if (
      !message.content.startsWith(client.prefix) ||
      message.author.bot ||
      !message.guild
    ) return;
    
    const args = message.content.substring(client.prefix.length).split(/\s+/);
    
    const commandName = args.shift();
    const command = client.getCommand(commandName);
    
    const needsDevAccess = (command?.devOnly && !client.isDev(message.author.id));
    
    if (
      !command ||
      needsDevAccess
    ) return;

    if (command.disabled) {
      return await message.reply({
        embeds: [
          client.embeds.invalid(`Command named \`${command.name}\` is currently disabled.`)
        ]
      });
    }

    client.updateJsonFile('./src/database/cooldowns.json', async cooldowns => {
      const cooldownCmdNames = Object.keys(cooldowns);
    
      for (const cmdName of cooldownCmdNames) {
        if (!client.commands.has(cmdName)) {
          delete cooldowns[cmdName];
        }
      }
    
      const isInCooldown = cooldowns.hasOwnProperty(command.name);
    
      if (!isInCooldown) {
        cooldowns[command.name] = {};
      }
    
      const timeStamps = cooldowns[command.name];
      const currentTime = Date.now();
      const cooldownTime = command.cooldown * 1000;
    
      const hasAuthor = timeStamps.hasOwnProperty(message.author.id);
    
      if (hasAuthor) {
        const expirationTime = cooldownTime + timeStamps[message.author.id];
      
        if (currentTime < expirationTime) {
          const timeLeft = expirationTime - currentTime;
        
          return await message.reply({
            embeds: [
              client.embeds.invalid(`You are still on cooldown for \`${command.name}\` for ${client.parseTime(timeLeft / 1000, short = true)}.`)
            ]
          });
        }
      }
    
      cooldowns[command.name][message.author.id] = currentTime;
    
      setTimeout(() => {
        
        delete cooldowns[command.name][message.author.id];
      }, cooldownTime);
    });
    
    const hasPermissions = message.member.permissions.has(command.permissions);
    
    if (!hasPermissions) {
      return await message.reply({
        embeds: [
          client.embeds.invalid(`You do not have the permissions required to use \`${command.name}\`.`)
        ]
      });
    }

    try {
			await command.run(message, args, command, client, Discord);
		} catch(e) {
			console.error(e);
      
			return await message.reply({
        embeds: [
          client.embeds.error('A problem occurred during the execution of the command.')
        ]
      });
		}
  }
}, once = false);