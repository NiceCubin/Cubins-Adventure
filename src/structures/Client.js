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
    this.utils = {};
    this.assets = {};
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
  
  unloadCommands() {
    this.commands.clear();
    
    for (const path in require.cache) {
      if (path.includes('src/commands')) {
        delete require.cache[path];
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

    for (const path in require.cache) {
      if (path.includes('src/events')) {
        delete require.cache[path];
      }
    }
  }
  
  loadUtils() {
    for (const file of readdirSync('./src/utils')) {
      if (file === 'misc.js') continue;
      
      this.utils[parse(file).name] = require(`../utils/${file}`);
    }
    
    Object.assign(this.utils, require('../utils/misc'));
  }
  
  unloadUtils() {
    this.utils = {};
    
    for (const path in require.cache) {
      if (path.includes('src/utils')) {
        delete require.cache[path];
      }
    }
  }
  
  loadAssets() {
    for (const file of readdirSync('./src/assets')) {
      this.assets[parse(file).name] = require(`../assets/${file}`);
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
  
  getCommand(cmdName) {
    return this.commands.find(cmd => cmd.triggers.map(trig => trig.toLowerCase()).includes(cmdName.toLowerCase()));
  }
  
  getCategory(catName) {
    return this.categories.find(cat => cat.name.toLowerCase() === catName.toLowerCase());
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