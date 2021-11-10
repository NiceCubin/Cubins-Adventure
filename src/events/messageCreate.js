const Discord = require('discord.js');

const Event = require('../structures/Event');
const embeds = require('../utils/embeds');

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
    const command = client.commands.find(cmd => cmd.triggers.map(trig => trig.toLowerCase()).includes(commandName.toLowerCase()));

    const invalidDev = (command?.devOnly && !client.devs.includes(message.author.id));
    
    if (
      command == null ||
      invalidDev
    ) return;

    const onCooldown = client.cooldowns.has(command.name);
    
    if (!onCooldown) {
      client.cooldowns.set(command.name, new Discord.Collection());
    }

    const timeStamps = client.cooldowns.get(command.name);
    const currentTime = Date.now();
    const cooldownTime = command.cooldown * 1000;

    if (timeStamps.has(message.author.id)) {
      const expirationTime = cooldownTime + timeStamps.get(message.author.id);

      if (currentTime < expirationTime) {
        const timeLeft = (expirationTime - currentTime) / 1000;
        const minsLeft = timeLeft / 60;
        const secsLeft = timeLeft - (Math.floor(minsLeft) * 60);

        const displayMins = `${Math.floor(minsLeft)} minutes and`;
        const displaySecs = `${timeLeft < 10 ? secsLeft.toFixed(1) : secsLeft.toFixed()} more seconds`;
        
        return message.reply({ embeds: [embeds.invalid(`You are on cooldown for \`${command.name}\` for${Math.floor(minsLeft) > 0 ? ` ${displayMins}` : ''} ${displaySecs}.`)] });
      }
    }
    
    timeStamps.set(message.author.id, currentTime);
    setTimeout(() => timeStamps.delete(message.author.id), cooldownTime); 
    
    const hasPermissions = message.member.permissions.has(command.permissions);

    if (!hasPermissions) {
      return message.reply({ embeds: [embeds.invalid(`You do not have the permissions required to use \`${command.name}\`.`)] });
    }

    command.run(message, args, command, client);
  }
}, false);