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
    this.assets = {};
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
        })
        .sort((a, b) => a.name.localeCompare(b.name));

      commands = commands.concat(category.commands);

      return category;
    });

    categories.forEach(cat => this.categories.set(cat.name, cat));
    commands.forEach(cmd => this.commands.set(cmd.name, cmd));
  }

  unloadCommands() {
    this.commands.clear()
    
    for (const dir of readdirSync('./src/commands')) {
      for (const file of readdirSync(`./src/commands/${dir}`)) {
        if (file == 'index.js') continue;
      
        delete require.cache[require.resolve(`../commands/${dir}/${file}`)];
      }
    }
  }

  loadEvents() {
    for (const file of readdirSync('./src/events')) {
      const event = require(`../events/${file}`);
      
      if (event.once) {
        this.once(event.event, event.run.bind(null, this));
      } else {
        this.on(event.event, event.run.bind(null, this));
      }
    }
  }
  
  unloadEvents() {
    this.removeAllListeners();
    
    for (const file of readdirSync('./src/events')) {
      delete require.cache[require.resolve(`../events/${file}`)];
    }
  }

  loadUtils() {
    Object.assign(this.utils, require('../utils/misc'));

    this.utils.embeds = require('../utils/embeds');
  }

  unloadUtils() {
    this.utils = {};

    for (const file of readdirSync('./src/utils')) {
      delete require.cache[require.resolve(`../utils/${file}`)];
    }
  }

  loadAssets() {
    for (const file of readdirSync('./src/assets')) {
      this.assets[file] = require(`../utils/assets/${file}`);
    }
  }

  unloadAssets() {
    this.assets = {};

    for (const file of readdirSync('./src/assets')) {
      delete require.cache[require.resolve(`../assets/${file}`)];
    }
  }

  start(token) {
    this.loadCommands();
    this.loadEvents();
    this.loadUtils();
    this.loadAssets();
    
    this.login(token);
  }
}

module.exports = Client;
