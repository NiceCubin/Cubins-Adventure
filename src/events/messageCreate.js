const fs = require('fs');

const Event = require('../structures/Event');
const embeds = require('../utils/embeds');
const { parseTime } = require('../utils/default');
const cooldowns = require('../database/cooldowns.json');

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

    const inCooldown = cooldowns.hasOwnProperty(command.name);

    if (!inCooldown) {
      cooldowns[command.name] = {};
      fs.writeFileSync('./src/database/cooldowns.json', JSON.stringify(cooldowns, null, 4));
    }

    const timeStamps = cooldowns[command.name];
    const currentTime = Date.now();
    const cooldownTime = command.cooldown * 1000;

    const hasAuthor = timeStamps.hasOwnProperty(message.author.id);
    
    if (hasAuthor) {
      const expirationTime = cooldownTime + timeStamps[message.author.id];

      if (currentTime < expirationTime) { 
        const timeLeft = expirationTime - currentTime;
        
        return message.reply({ embeds: [embeds.invalid(`You are still on cooldown for \`${command.name}\` for ${parseTime(timeLeft, short = true)}.`)] });
      }
    }
    
    cooldowns[command.name][message.author.id] = currentTime;
    fs.writeFileSync('./src/database/cooldowns.json', JSON.stringify(cooldowns, null, 4));
    
    setTimeout(() => {
      delete cooldowns[command.name][message.author.id];
      fs.writeFileSync('./src/database/cooldowns.json', JSON.stringify(cooldowns, null, 4));
    }, cooldownTime); 
    
    const hasPermissions = message.member.permissions.has(command.permissions);

    if (!hasPermissions) {
      return message.reply({ embeds: [embeds.invalid(`You do not have the permissions required to use \`${command.name}\`.`)] });
    }

    command.run(message, args, command, client);
  }
}, false);
