const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");

class Client extends Discord.Client {
  constructor(options) {
    super(options);

    this.prefix = options.prefix;
    this.categories = new Discord.Collection();
    this.commands = new Discord.Collection();
  }

  start(token) {
    const categoryFiles = fs.readdirSync("./src/commands");
    const categories = categoryFiles.map(cat => require(`../commands/${cat}`));
    let commands = [];
    
    categoryFiles.forEach(categoryFile => {
      const categoryDir = `./src/commands/${categoryFile}`
      const commandFiles = fs.readdirSync(categoryDir).filter(file => file !== "index.js");
      const categoryCommands = commandFiles.map(file => {
        const command = require(`../commands/${categoryFile}/${file}`);
        command.category = require(path.relative(__dirname, categoryDir));
      
        return command;
      });
     
      commands = commands.concat(Array.from(categoryCommands));
    });

    categories.forEach(cat => this.categories.set(cat.name, cat));
    commands.forEach(cmd => this.commands.set(cmd.name, cmd));

    this.removeAllListeners();
    
    fs.readdirSync("./src/events").forEach(file => {
      const event = require(`../events/${file}`);
      
      if (event.once) {
        this.once(event.event, event.run.bind(null, this));
      } else {
        this.on(event.event, event.run.bind(null, this));
      }
    });                                                      

    this.login(token);
  }
}

module.exports = Client;
