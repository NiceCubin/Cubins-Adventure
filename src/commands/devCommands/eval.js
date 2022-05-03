const { inspect } = require('util');

const Command = require('../../structures/Command');

module.exports = new Command({
  filename: __filename,
  triggers: ['eval', 'evaluate'],
  description: 'evaluates inputted code.',
  cooldown: 0,
  usage: ['<code>'],
  permissions: [],
  devOnly: true,
  async run(message, args, thisCommand, client, Discord) {
    const code = args.join(' ');
    const result = new Promise(resolve => resolve(eval(code)));
    
    if (!code) {
      return await message.reply({
        embeds: [
          client.embeds.error('You must input code to evaluate.')
        ]
      });
    }
        
    return result.then(async output => {
      output = inspect(output, { depth: 0 });
      output = output
        .replace(client.token, '[Insert Token Here]')
        .replace(/^["'](.+(?=["']$))["']$/, '$1');
      
      await message.channel.send(client.toCodeBlock(output));
      return await message.delete();
    }).catch(async err => {
      err = err
        .toString()
        .replace(client.token, '[Insert Token Here]');
      
      return await message.reply({
        embeds: [
          client.embeds.error(`\`${err}\``)
        ]
      });
    });
  }
});