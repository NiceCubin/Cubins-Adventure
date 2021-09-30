const Event = require("../structures/Event");

module.exports = new Event("ready", client => console.log("\x1b[35m%s\x1b[0m",`Ready: ${client.user.tag}\nServers: ${client.guilds.cache.size}`), true);