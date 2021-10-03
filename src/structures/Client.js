const Discord = require('discord.js');
const fs = require('fs');

class Client extends Discord.Client {
  constructor(options) {
    super(options);

    this.prefix = options.prefix;
    this.categories = new Discord.Collection();
    this.commands = new Discord.Collection();
    this.cooldowns = new Map();
  }

  start(token) {
    let commands = [];
    const categories = fs.readdirSync('./src/commands').map(cat => {
      const category = require(`../commands/${cat}`);
      category.commands = fs.readdirSync(`./src/commands/${cat}`)
        .filter(file => file !== "index.js")
        .map(file => {
          const command = require(`../commands/${cat}/${file}`);
          command.category = category;

          return command;
        });

      commands = commands.concat(category.commands);

      return category;
    });

    categories.forEach(cat => this.categories.set(cat.name, cat));
    commands.forEach(cmd => this.commands.set(cmd.name, cmd));

    this.removeAllListeners();
    
    fs.readdirSync('./src/events').forEach(file => {
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