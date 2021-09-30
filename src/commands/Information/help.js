const Command = require("../../structures/Command");
const embeds = require("../../utils/embeds");

module.exports = new Command({
  name: "help",
  description: "shows help for commands.",
  async run(message, args, client) {
    const helpName = args[1];
    categoryNames = client.categories
      .map(cat => cat.name)
      .sort(cat => cat.name);
    
    commandNames = client.commands
      .map(cmd => cmd.name)
      .sort(cmd => cmd.name);
    
    if (helpName == null) {
      const embed = {
        title: "Cubin's Adventure Command Help",
        description: `\`${client.prefix}${require(__filename).name} [category]\``,
        color: 0xff00ff,
        fields: []
      }
      
        client.categories.forEach(category => {
        embed.fields = embed.fields.concat({
          name: `${client.emojis.cache.get(category.emojiID)} ${category.name}`,
          value: category.description,
          inline: false
        });
      });
      
      return await message.reply({embeds: [embed]});
    }

    for (const cat of categoryNames) {
      if (cat.toLowerCase() === helpName.toLowerCase()) {
        const category = client.categories.get(cat);
      
        return await message.reply({embeds: [
          {
            title: `${client.emojis.cache.get(category.emojiID)} ${category.name} Commands`,
            description: `\`${category.commands.map(cmd => cmd.name).join(", ")}\``,
            color: 0xff00ff,
            footer: {
              text: `use '${client.prefix} ${require(__filename).name} [command]' for command info`
            }
          }
        ]});
      }
    }
    
    for (const cmd of commandNames) {
      if (cmd.toLowerCase() === helpName.toLowerCase()) {
        const command = client.commands.get(cmd);
      
        return await message.reply({embeds: [
          {
            title: "Command Help Placeholder",
            description: "temporarily blank",
            color: 0xff00ff,
            footer: {
              text: `use '${client.prefix} ${require(__filename).name} [command]' for command info`
            }
          }
        ]});
      }
    }

    return await message.reply({embeds: [embeds.invalid(`No Command or Command Category named \`${helpName}\`.`)]});
  }
});