const Event = require('../structures/Event');

module.exports = new Event({
  filename: __filename,
  event: 'ready',
  once: true,
  async run(client) {
    console.log('\x1b[35m%s\x1b[0m',`Ready: ${client.user.tag}\nServers: ${client.guilds.cache.size}`);
  }
}, once = true);