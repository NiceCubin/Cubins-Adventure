const Command = require('../../structures/Command');

const embeds = require('../../utils/embeds');
const { parseTime } = require('../../utils/default')
;
module.exports = new Command({
  triggers: ['stats', 'botinfo'],
  description: 'shows basic statistics of the bot.',
  cooldown: 10,
  usage: [],
  permissions: [],
  devOnly: false,
  async run(message, args, command, client) {
    
    await message.channel.send({
      embeds: [
        {
          title: 'Cubin\'s Adventure Info',
          thumbnail: { url: client.user.avatarURL() },
          fields: [
            { name: 'Version', value: client.version },
            { name: 'Servers', value: JSON.stringify(client.guilds.cache.size) },
            { name: 'Ping', value: `${client.ws.ping}ms` },
            { name: 'Uptime', value: parseTime(client.uptime) }
          ],
          color: 0xff00ff
        }
      ]
    });
  }
} );