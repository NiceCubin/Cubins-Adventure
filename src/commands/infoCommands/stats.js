const Command = require('../../structures/Command');

module.exports = new Command({
  triggers: ['stats', 'botinfo'],
  description: 'shows basic statistics of the bot.',
  cooldown: 10,
  usage: [],
  permissions: [],
  devOnly: false,
  async run(message, args, command, client) {
    await message.reply({
      embeds: [
        {
          title: 'Cubin\'s Adventure Info',
          thumbnail: { url: client.user.avatarURL() },
          fields: [
            { name: 'Version', value: client.version },
            { name: 'Servers', value: JSON.stringify(client.guilds.cache.size) },
            { name: 'Ping', value: `${client.ws.ping}ms` },
            { name: 'Uptime', value: client.utils.parseTime(client.uptime) }
          ],
          color: 0xff00ff
        }
      ]
    });
  }
});