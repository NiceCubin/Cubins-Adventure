const Command = require('../../structures/Command');
const embeds = require('../../utils/embeds');

module.exports = new Command({
  triggers: ['stats', 'botinfo'],
  description: 'shows basic statistics of the bot.',
  cooldown: 10,
  usage: '',
  permissions: [],
  devOnly: false,
  async run(message, args, command, client) {
    await message.channel.send({
      embeds: [
        {
          title: 'Cubin\'s Adventure Info',
          color: 0xff00ff,
          fields: [
            { name: 'Version', value: 'null' },
            { name: 'Servers', value: JSON.stringify(client.guilds.cache.size) },
            { name: 'Shards', value: 'null' },
            { name: 'Latency', value: `${client.ws.ping}ms` },
            { name: 'Uptime', value: JSON.stringify(client.uptime) }
          ],
          thumbnail: { url: client.user.avatarURL() }
        }
      ]
    });
  }
} );