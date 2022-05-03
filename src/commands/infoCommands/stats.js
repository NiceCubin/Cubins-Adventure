const Command = require('../../structures/Command');

module.exports = new Command({
  filename: __filename,
  triggers: ['stats', 'botinfo'],
  description: 'shows basic statistics of the bot.',
  cooldown: 10,
  usage: [],
  permissions: [],
  devOnly: false,
  async run(message, args, thisCommand, client, Discord) {
    return await message.reply({
      embeds: [
        {
          thumbnail: { url: client.user.avatarURL() },
          title: `${client.user.username} Info`,
          fields: [
            { name: 'Version', value: client.package.version },
            { name: 'Servers', value: JSON.stringify(client.guilds.cache.size) },
            { name: 'Ping', value: `${client.ws.ping}ms` },
            { name: 'Uptime', value: client.parseTime(process.uptime()) }
          ],
          color: 0xFF00FF
        }
      ]
    });
  }
});