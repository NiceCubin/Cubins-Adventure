const Discord = require('discord.js');

const Event = require('../structures/Event');
const embeds = require('../utils/embeds');

module.exports = new Event({
  event: 'messageCreate',
  run(client, message) {
    stringAuthorID = message.author.id.toString();
    
    if (
      !message.content.startsWith(client.prefix) ||
      message.author.bot ||
      !message.guild
    ) return;
    
    const args = message.content.substring(client.prefix.length).split(/\s+/g);
    
    const commandName = args.shift();
    const command = client.commands.find(cmd => cmd.triggers.map(trig => trig.toLowerCase()).includes(commandName.toLowerCase()));
    
    if (command == null) return;

    const invalidDev = command.devOnly && !client.devs.includes(stringAuthorID);
    
    if (invalidDev) return;

    if (!client.cooldowns.has(command.name)) {
      client.cooldowns.set(command.name, new Discord.Collection());
    }

    const timeStamps = client.cooldowns.get(command.name);
    const currentTime = Date.now();
    const cooldownTime = command.cooldown * 1000;

    if (timeStamps.has(stringAuthorID)) {
      const expirationTime = cooldownTime + timeStamps.get(stringAuthorID);

      if (currentTime < expirationTime) {
        const timeLeft = (expirationTime - currentTime) / 1000;

        return message.reply({ embeds: [embeds.invalid(`You are on cooldown for \`${command.name}\` for ${timeLeft.toFixed(1)} more seconds.`)] });
      }
    }
    
    timeStamps.set(stringAuthorID, currentTime);
    setTimeout(() => timeStamps.delete(stringAuthorID), cooldownTime); 
    
    const hasPermissions = message.member.permissions.has(command.permissions);

    if (!hasPermissions) {
      return message.reply({ embeds: [embeds.invalid(`You do not have the permissions required to use \`${command.name}\`.`)] });
    }

    command.run(message, args, command, client);
  }
});