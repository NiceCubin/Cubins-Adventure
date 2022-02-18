const Discord = require('discord.js');
const { readdirSync } = require('fs');
const { parse } = require('path');

class Client extends Discord.Client {
  constructor(options) {
    super(options);
    
    this.package = options.package;
    this.prefix = options.prefix;
    this.devs = options.devs;
    this.cooldowns = require('../database/cooldowns.json');
    this.categories = new Discord.Collection();
    this.commands = new Discord.Collection();
    this.disabledCommands = new Discord.Collection();
    this.utils = {};
    this.assets = {};
  }

  loadCommand(commandName) {
    const disabledCommand = this.getDisabledCommand(commandName);

    if (!disabledCommand) {
      return false;
    }

    const newCommand = require(disabledCommand.filename);
    newCommand.category = disabledCommand.category;

    this.disabledCommands.delete(commandName);
    this.commands.set(newCommand.name, newCommand);
    
    return true;
  }
  
  loadCommands() {
    let categories = [];
    let commands = [];
    
    for (const dir of readdirSync('./src/commands')) {
      const category = require(`../commands/${dir}`);
      
      category.commands = [];
      
      for (const file of readdirSync(`./src/commands/${dir}`)) {
        if (file === 'index.js') continue;
        
        const command = require(`../commands/${dir}/${file}`);
        
        command.category = category;
        category.commands.push(command);
      }
      
      categories.push(category);
      commands = commands.concat(category.commands);
    }
    
    categories.forEach(cat => this.categories.set(cat.name, cat));
    commands.forEach(cmd => this.commands.set(cmd.name, cmd));
  }
  
  loadEvents() {
    for (const file of readdirSync('./src/events')) {
      const event = require(`../events/${file}`);

      const emitterMethod = event.once ? 'once' : 'on';
      
      this[emitterMethod](event.event, event.run.bind(null, this));
    }
  }
  
  loadUtils() {
    for (const file of readdirSync('./src/utils')) {
      if (file === 'misc.js') continue;
      
      this.utils[parse(file).name] = require(`../utils/${file}`);
    }
    
    Object.assign(this.utils, require('../utils/misc'));
  }
  
  loadAssets() {
    for (const file of readdirSync('./src/assets')) {
      this.assets[parse(file).name] = require(`../assets/${file}`);
    }
  }

  unloadCommand(commandName) {
    const command = this.getCommand(commandName);
    
    if (!command) {
      return false;
    }

    delete require.cache[require.resolve(command.filename)];

    this.commands.delete(commandName);
    this.disabledCommands.set(commandName, command);
    
    return true;
  }
  
  unloadCommands() {
    this.commands.forEach(cmd => this.disabledCommands.set(cmd.name, cmd));
    this.commands.clear();
    
    for (const path in require.cache) {
      if (path.includes('src/commands')) {
        delete require.cache[path];
      }
    }
  }
  
  unloadEvents() {
    this.removeAllListeners();

    for (const path in require.cache) {
      if (path.includes('src/events')) {
        delete require.cache[path];
      }
    }
  }
  
  unloadUtils() {
    this.utils = {};
    
    for (const path in require.cache) {
      if (path.includes('src/utils')) {
        delete require.cache[path];
      }
    }
  }
  
  unloadAssets() {
    this.assets = {};
    
    for (const path in require.cache) {
      if (path.includes('src/assets')) {
        delete require.cache[path];
      }
    }
  }
  
  getCommand(commandName) {
    return this.commands.find(cmd => cmd.triggers.map(trig => trig.toLowerCase()).includes(commandName.toLowerCase()));
  }

  getDisabledCommand(commandName) {
    return this.disabledCommands.find(cmd => cmd.triggers.map(trig => trig.toLowerCase()).includes(commandName.toLowerCase()));
  }
  
  getCategory(categoryName) {
    return this.categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
  }
  
  isDev(userID) {
    return this.devs.includes(userID);
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