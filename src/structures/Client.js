const Discord = require("discord.js");
const fs = require("fs");

class Client extends Discord.Client {
  constructor(options) {
    super(options);
    
    if (typeof options.prefix === "undefined") {
      throw new TypeError("CLIENT_MISSING_PREFIX");
    }

    this.prefix = options.prefix;
    this.commands = new Discord.Collection();
  }

  start(token) {
    const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"));
    const commands = commandFiles.map(file => require(`../commands/${file}`));
    commands.forEach(command => {
      this.commands.set(command.name, command);
    });

    this.removeAllListeners();
    
    fs.readdirSync("./src/events").filter(file => file.endsWith(".js")).forEach(file => {
      const event = require(`../events/${file}`);	
      this.on(event.event, event.run.bind(null, this));
    });                                                      

    this.login(token);
  }
}

module.exports = Client;