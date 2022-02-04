const Discord = require('discord.js');

const Event = require('../structures/Event');

module.exports = new Event({
  event: 'messageCreate',
  run(client, message) {
    if (
      !message.content.startsWith(client.prefix) ||
      message.author.bot ||
      !message.guild
    ) return;
    
    const args = message.content.substring(client.prefix.length).split(/\s+/);
    
    const commandName = args.shift();
    const command = client.getCommand(commandName);
    
    const hasDevAccess = (command?.devOnly && !client.isDev(message.author.id));
    
    if (
      !command ||
      hasDevAccess
    ) return;
    
    const cooldownCmds = Object.keys(client.cooldowns);
    
    for (const cmdName of cooldownCmds) {
      if (!client.commands.has(cmdName)) {
        delete client.cooldowns[cmdName];
      }
    }
    
    const isInCooldown = client.cooldowns.hasOwnProperty(command.name);
    
    if (!isInCooldown) {
      client.cooldowns[command.name] = {};
    }
    
    const timeStamps = client.cooldowns[command.name];
    const currentTime = Date.now();
    const cooldownTime = command.cooldown * 1000;
    
    const hasAuthor = timeStamps.hasOwnProperty(message.author.id);
    
    if (hasAuthor) {
      const expirationTime = cooldownTime + timeStamps[message.author.id];
      
      if (currentTime < expirationTime) {
        const timeLeft = expirationTime - currentTime;
        
        return message.reply({ embeds: [client.utils.embeds.invalid(`You are still on cooldown for \`${command.name}\` for ${client.utils.parseTime(timeLeft, short = true)}.`)] });
      }
    }
    
    client.cooldowns[command.name][message.author.id] = currentTime;
    
    setTimeout(() => {
      delete client.cooldowns[command.name][message.author.id];
      
      client.utils.updateJsonFile('./src/database/cooldowns.json', client.cooldowns);
    }, cooldownTime);
    
    client.utils.updateJsonFile('./src/database/cooldowns.json', client.cooldowns);
    
    const hasPermissions = message.member.permissions.has(command.permissions);
    
    if (!hasPermissions) {
      return message.reply({ embeds: [client.utils.embeds.invalid(`You do not have the permissions required to use \`${command.name}\`.`)] });
    }
    
    command.run(message, args, command, client, Discord);
  }
}, once = false);