const Discord = require('discord.js');

class Category {
  constructor(options) {
    this.dirname = options.dirname;
    this.triggers = options.triggers;
    this.description = options.description;
    this.emojiID = options.emojiID;
    this.hidden = options.hidden
    this.name = this.triggers[0][0].toUpperCase() + this.triggers[0].slice(1).toLowerCase();
    this.commands = new Discord.Collection();
  }
}

module.exports = Category;