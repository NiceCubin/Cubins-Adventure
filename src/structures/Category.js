class Category {
  constructor(options) {
    this.dirname = options.dirname;
    this.name = options.name;
    this.description = options.description;
    this.emojiID = options.emojiID;
    this.hidden = options.hidden;
  }
}

module.exports = Category;