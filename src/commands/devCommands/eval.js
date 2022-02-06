const { inspect } = require('util');

const Command = require('../../structures/Command');

module.exports = new Command({
  triggers: ['eval', 'evaluate'],
  description: 'evaluates inputted code.',
  cooldown: 0,
  usage: ['<*code>'],
  permissions: [],
  devOnly: true,
  async run(message, args, command, client, Discord) {
    const code = args.join(' ');
    
    if (code === '') {
      return await message.reply({ embeds: [client.utils.embeds.error('You must input code to evaluate.')] });
    }
    
    const result = new Promise(resolve => resolve(eval(code)));
        
    return result.then(async output => {
      output = inspect(output, { depth: 0 });
      output = output.replace(client.token, '<insertTokenHere>');
      output = output.replace(/^["'](.+(?=["']$))["']$/, '$1');
      output = client.utils.toCodeBlock(output);
      
      await message.channel.send(output);
      return await message.delete();
    }).catch(async err => {
      err = err.toString();
      err = err.replace(client.token, '<insertTokenHere>');
      err = `\`${err}\``;
      
      return await message.reply({ embeds: [client.utils.embeds.error(err)] });
    });
  }
});