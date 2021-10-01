class Category {
  constructor(options) {
    this.name = options.name;
    this.description = options.description;
    this.emojiID = options.emojiID;
    this.commands = options.commands;
  }
}

module.exports = Category;