const Command = require('../../structures/Command');

module.exports = new Command({
  filename: __filename,
  triggers: ['reload'],
  description: 'reloads a category, command, event, util, or asset.',
  cooldown: 0,
  usage: ['<type>', '<name>'],
  permissions: [],
  devOnly: true,
  async run(message, args, thisCommand, client, Discord) {
    const type = args[0];
    const name = args[1];

    if (!type) {
      return await message.reply({
        embeds: [
          client.embeds.invalid('You must input a type.')
        ]
      });
    }
    
    switch (type) {
      case 'category':
      case 'cat':
        const category = client.getCategory(name);
    
        if (!category) {
          return await message.reply({ embeds: [client.embeds.invalid(`No category named \`${name}\` found.`)] });
        }
        
        delete require.cache[require.resolve(category.dirname)];
        
        const newCategory = require(category.dirname);
        newCategory.commands = category.commands;
    
        client.categories.set(newCategory.name, newCategory);
        
        return await message.reply(`Successfully reloaded category \`${category.name}\`.`);
      
      case 'command':
      case 'cmd':
        const command = client.getCommand(name);
    
        if (!command) {
          return await message.reply({
            embeds: [
              client.embeds.invalid(`No command named \`${name}\` found.`)
            ]
          });
        }
        
        delete require.cache[require.resolve(command.filename)];
        
        const newCommand = require(command.filename);
        newCommand.category = command.category;
    
        client.commands.set(newCommand.name, newCommand);
        
        return await message.reply(`Successfully reloaded command \`${command.name}\`.`);
      
      case 'event':
        break
      
      case 'util':
        break
      
      case 'asset':
        break
      
      default:
        return await message.reply({
          embeds: [
            client.embeds.invalid(`No type named \`${type}\`. Please use \`category\`, \`command\`, \`event\`, \`util\`, \`asset\`, or \`all\`.`)
          ]
        });
    }
  }
});