const Discord = require('discord.js');
const { readdirSync } = require('fs');

class Client extends Discord.Client {
  constructor(options) {
    super(options);

    this.version = options.version;
    this.prefix = options.prefix;
    this.devs = options.devs;
    this.categories = new Discord.Collection();
    this.commands = new Discord.Collection();
    this.utils = {};
    this.cooldowns = require('../database/cooldowns.json');
  }

  loadCommands() {
    let commands = [];
    
    const categories = readdirSync('./src/commands').map(cat => {
      const category = require(`../commands/${cat}`);
      category.commands = readdirSync(`./src/commands/${cat}`)
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
  }

  unloadCommands() {
    this.commands.clear()
    
    readdirSync('./src/commands').forEach(cat => {
      readdirSync(`./src/commands/${cat}`)
        .filter(file => file !== "index.js")
        .forEach(cmd => {
          delete require.cache[require.resolve(`../commands/${cat}/${cmd}`)];
        });
    });
  }

  loadEvents() {
    readdirSync('./src/events').forEach(file => {
      const event = require(`../events/${file}`);
      
      if (event.once) {
        this.once(event.event, event.run.bind(null, this));
      } else {
        this.on(event.event, event.run.bind(null, this));
      }
    });
  }
  
  unloadEvents() {
    this.removeAllListeners();
    
    readdirSync('./src/events').forEach(file => {
      delete require.cache[require.resolve(`../events/${file}`)];
    });
  }

  loadUtils() {
    Object.assign(this.utils, require('../utils/misc'));

    this.utils.embeds = require('../utils/embeds');
  }

  unloadUtils() {
    this.utils = {};

    readdirSync('./src/utils').forEach(file => {
      delete require.cache[require.resolve(`../utils/${file}`)];
    });
  }

  start(token) {
    this.loadCommands();
    this.loadEvents();
    this.loadUtils();
    
    this.login(token);
  }
}

module.exports = Client;
