const Command = require('../../structures/Command');

module.exports = new Command({
  triggers: ['stats', 'botinfo'],
  description: 'shows basic statistics of the bot.',
  cooldown: 10,
  usage: [],
  permissions: [],
  devOnly: false,
  async run(message, args, command, client, Discord) {
    return await message.reply({
      embeds: [
        {
          title: `${client.user.username} Info`,
          thumbnail: { url: client.user.avatarURL() },
          fields: [
            { name: 'Version', value: client.package.version },
            { name: 'Servers', value: JSON.stringify(client.guilds.cache.size) },
            { name: 'Ping', value: `${client.ws.ping}ms` },
            { name: 'Uptime', value: client.utils.parseTime(process.uptime() * 1000) }
          ],
          color: 0xff00ff
        }
      ]
    });
  }
});