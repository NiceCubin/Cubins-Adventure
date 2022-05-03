const Discord = require('discord.js');
const { readdirSync } = require('fs');
const { parse } = require('path');

class Client extends Discord.Client {
  constructor(options) {
    super(options);
    
    this.package = options.package;
    this.prefix = options.prefix;
    this.devs = options.devs;
    this.categories = new Discord.Collection();
    this.commands = new Discord.Collection();
    this.assets = {};
  }

  loadCommands() {
    for (const dir of readdirSync('./src/commands')) {
      const category = require(`../commands/${dir}`);
      
      for (const file of readdirSync(`./src/commands/${dir}`)) {
        if (file === 'index.js') continue;
        
        const command = require(`../commands/${dir}/${file}`);
        command.category = category;
        
        category.commands.set(command.name, command);
        this.commands.set(command.name, command);
      }
      
      this.categories.set(category.name, category);
    }
  }
  
  loadEvents() {
    for (const file of readdirSync('./src/events')) {
      const event = require(`../events/${file}`);
      const onMethod = event.once ? 'once' : 'on';
      
      this[onMethod](event.event, event.run.bind(null, this));
    }
  }
  
  loadUtils() {
    for (const file of readdirSync('./src/utils')) {
      if (file === 'misc.js') continue;
      
      this[parse(file).name] = require(`../utils/${file}`);
    }
    
    Object.assign(this, require('../utils/misc'));
  }
  
  loadAssets() {
    for (const file of readdirSync('./src/assets')) {
      this.assets[parse(file).name] = require(`../assets/${file}`);
    }
  }
  
  getCommand(commandName) {
    return this.commands.find(cmd => cmd.triggers.map(trig => trig.toLowerCase()).includes(commandName.toLowerCase()));
  }
  
  getCategory(categoryName) {
    return this.categories.find(cat => cat.triggers.map(trig => trig.toLowerCase()).includes(categoryName.toLowerCase()));
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