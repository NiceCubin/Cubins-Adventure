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
    const command = client.commands.find(cmd => cmd.triggers.map(trig => trig.toLowerCase()).includes(commandName.toLowerCase()));

    const invalidDev = (command?.devOnly && !client.devs.includes(message.author.id));
    
    if (
      command == null ||
      invalidDev
    ) return;

    const cooldownCmds = Object.keys(client.cooldowns);
    
    for (const cmd of cooldownCmds) {
      if (client.commands.has(cmd)) {
        delete client.cooldowns[cmd];
        client.utils.updateJsonFile('./src/database/cooldowns.json', client.cooldowns);
      }
    }

    const inCooldown = client.cooldowns.hasOwnProperty(command.name);

    if (!inCooldown) {
      client.cooldowns[command.name] = {};
      client.utils.updateJsonFile('./src/database/cooldowns.json', client.cooldowns);
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
    client.utils.updateJsonFile('./src/database/cooldowns.json', client.cooldowns);
    
    setTimeout(() => {
      delete client.cooldowns[command.name][message.author.id];
      client.utils.updateJsonFile('./src/database/cooldowns.json', client.cooldowns);
    }, cooldownTime);
    
    const hasPermissions = message.member.permissions.has(command.permissions);

    if (!hasPermissions) {
      return message.reply({ embeds: [client.utils.embeds.invalid(`You do not have the permissions required to use \`${command.name}\`.`)] });
    }

    command.run(message, args, command, client);
  }
}, once = false);
